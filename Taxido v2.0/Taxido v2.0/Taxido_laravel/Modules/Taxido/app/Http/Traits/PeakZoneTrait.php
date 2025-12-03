<?php

namespace Modules\Taxido\Http\Traits;

use Carbon\Carbon;
use Sk\Geohash\Geohash;
use Modules\Taxido\Models\Zone;
use Modules\Taxido\Models\Ride;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\FireStoreTrait;
use Modules\Taxido\Models\PeakZone;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Objects\LineString;

trait PeakZoneTrait
{
    use FireStoreTrait;

    /**
     * Generate optimized polygon coordinates around a center point.
     */
    protected function generatePolygonCoordinates(float $centerLat, float $centerLng, float $radiusKm, int $numPoints = 5): array
    {
        $coordinates = [];
        $earthRadius = 6371; // km

        for ($i = 0; $i < $numPoints; $i++) {
            $bearing = deg2rad(360 / $numPoints * $i);
            $latRad = deg2rad($centerLat);
            $lngRad = deg2rad($centerLng);
            $distRatio = $radiusKm / $earthRadius;
            $newLatRad = asin(sin($latRad) * cos($distRatio) + cos($latRad) * sin($distRatio) * cos($bearing));
            $newLngRad = $lngRad + atan2(sin($bearing) * sin($distRatio) * cos($latRad), cos($distRatio) - sin($latRad) * sin($newLatRad));
            $coordinates[] = [
                'lat' => rad2deg($newLatRad),
                'lng' => rad2deg($newLngRad),
            ];
        }

        $coordinates[] = $coordinates[0]; // Close polygon
        return $coordinates;
    }

    /**
     * Check for overlapping peak zones efficiently (spatial only).
     */
    protected function hasOverlappingPeakZone(int $zoneId, Polygon $newPolygon): bool
    {
        $wkt = $newPolygon->toWKT();
        return PeakZone::where('zone_id', $zoneId)
                    ->where('is_active', true)
                    ->whereNotNull('polygon')
                    ->whereRaw('ST_Intersects(ST_SRID(polygon, 4326), ST_GeomFromText(?, 4326))', [$wkt])
                    ->exists();
    }

    /**
     * Deactivate overlapping peak zones and update Firestore (spatial only).
     */
    protected function deactivateOverlappingPeakZones(int $zoneId, Polygon $newPolygon): void
    {
        $overlappingZones = PeakZone::where('zone_id', $zoneId)
            ->where('is_active', true)
            ->whereNotNull('polygon')
            ->whereRaw('ST_Intersects(ST_SRID(polygon, 4326), ST_GeomFromText(?, 4326))', [$newPolygon->toWKT()])
            ->get();

        foreach ($overlappingZones as $zone) {
            $now = Carbon::now();
            // Ensure ends_at is always set, even if it was null before
            $zone->update([
                'is_active' => false,
                'ends_at' => $now,
                'updated_at' => $now
            ]);
            $coordinates = $zone->locations ?? [];

            $this->fireStoreAddDocument("peak_zones/{$zoneId}/expired", [
                'id' => (string)$zone->id,
                'name' => $zone->name,
                'active' => false,
                'g' => (new Geohash())->encode($coordinates[0]['lat'] ?? 0, $coordinates[0]['lng'] ?? 0, 12),
                'start_time' => $zone->starts_at->format('H:i:s'),
                'start_time_timestamp' => $zone->starts_at->timestamp,
                'end_time' => $now->format('H:i:s'),
                'end_time_timestamp' => $now->timestamp,
                'coordinates' => $coordinates,
                'updated_at' => $now->format('Y-m-d\TH:i:s.v\Z'),
            ], (string)$zone->id);

            $this->fireStoreDeleteDocument("peak_zones/{$zoneId}/active", (string)$zone->id);
            Log::info("Deactivated overlapping peak zone", ['zone_id' => $zone->id]);
        }
    }

    /**
     * Validate and generate a peak zone based on ride pickup locations.
     */
    protected function validateAndGeneratePeakZone(float $pickLat, float $pickLng, int $zoneId, string $timezone): ?PeakZone
    {
        $zone = Zone::find($zoneId);
        if (!$zone || !$zone->minutes_choosing_peak_zone || !$zone->peak_price_increase_percentage) {
            return null;
        }

        Log::info('zone finded for peak zone', ['zone_id' => $zoneId, 'zone' => $zone]);


        // Validate peak zone parameters
        if ($zone->minutes_choosing_peak_zone <= 0 || $zone->peak_price_increase_percentage <= 0 ||
            $zone->peak_zone_geographic_radius <= 0 || $zone->total_rides_in_peak_zone <= 0) {
            Log::warning('Invalid peak zone parameters', ['zone_id' => $zoneId]);
            return null;
        }

        $searchRadius = $zone->peak_zone_geographic_radius; // km
        $expiryDuration = $zone->minutes_peak_zone_active;
        $minimumNoRides = $zone->total_rides_in_peak_zone;
        $distancePricePercentage = $zone->peak_price_increase_percentage;

        $currentTime = Carbon::now()->setTimezone($timezone);
        $subTime = $currentTime->copy()->subMinutes($zone->minutes_choosing_peak_zone);

        $haversine = "(6371 * acos(cos(radians($pickLat)) * cos(radians(JSON_EXTRACT(location_coordinates, '$[0].lat'))) * cos(radians(JSON_EXTRACT(location_coordinates, '$[0].lng')) - radians($pickLng)) + sin(radians($pickLat)) * sin(radians(JSON_EXTRACT(location_coordinates, '$[0].lat')))))";
        $rides = Ride::select('rides.*')->selectRaw("{$haversine} AS distance")
                ->whereRaw("{$haversine} < ?", [$searchRadius])
                ->where('created_at', '>=', $subTime)
                ->whereHas('zones', function ($q) use ($zoneId) {
                    $q->where('zone_id', $zoneId);
                })->get();

        $rideCount = $rides?->count();

        Log::info('rideCount', ['rideCount' => $rideCount, 'minimumNoRides' => $minimumNoRides, 'zone' => $zone]);


        if ($rideCount < $minimumNoRides) {
            return null;
        }

        $centerLat = $pickLat;
        $centerLng = $pickLng;
        $zoneName = $zone->name ?? 'Unknown Location';

        // Use database locking to prevent race conditions
        DB::transaction(function () use ($zoneId) {
            Zone::where('id', $zoneId)->lockForUpdate()->first();
            usleep(5000); // 5ms delay
        });

        // Generate a new polygon for the current location
        $polygonCoordinates = $this->generatePolygonCoordinates($centerLat, $centerLng, $searchRadius, 8); // Use 8 points for better accuracy
        $points = array_map(fn($coord) => new Point($coord['lat'], $coord['lng']), $polygonCoordinates); // No SRID on Points
        $lineString = new LineString($points);
        $polygon = new Polygon([$lineString], 4326); // SRID only on top-level Polygon

        $startsAt = Carbon::now();
        $endsAt = $startsAt->copy()->addMinutes($expiryDuration);

        // Check if there's an active peak zone that contains this point
        $existingActiveZone = PeakZone::where('zone_id', $zoneId)
            ->where('is_active', true)
            ->whereNotNull('polygon')
            ->whereRaw('ST_Contains(ST_SRID(polygon, 4326), ST_GeomFromText(?, 4326))', ["POINT($centerLat $centerLng)"])
            ->first();

        Log::info('existingActiveZone', [$existingActiveZone]);

        if ($existingActiveZone) {
            $newEndsAt = Carbon::now()->addMinutes($zone->minutes_peak_zone_active);
            if ($existingActiveZone->ends_at && $existingActiveZone->ends_at->lt($newEndsAt)) {
                $existingActiveZone->update(['ends_at' => $newEndsAt, 'updated_at' => Carbon::now()]);
            }

            Log::info('Extended existing active peak zone', ['zone_id' => $zoneId, 'peak_zone_id' => $existingActiveZone->id]);
            return $existingActiveZone;
        }

                Log::info('hasOverlappingPeakZone', [$this->hasOverlappingPeakZone($zoneId, $polygon)]);

        // Check for overlapping peak zones
        if ($this->hasOverlappingPeakZone($zoneId, $polygon)) {
            $overlappingZone = PeakZone::where('zone_id', $zoneId)
                ->where('is_active', true)
                ->whereNotNull('polygon')
                ->whereRaw('ST_Intersects(ST_SRID(polygon, 4326), ST_GeomFromText(?, 4326))', [$polygon->toWKT()])
                ->first();

            if ($overlappingZone) {
                $newEndsAt = Carbon::now()->addMinutes($zone->minutes_peak_zone_active);
                if ($overlappingZone->ends_at && $overlappingZone->ends_at->lt($newEndsAt)) {
                    $overlappingZone->update([
                        'ends_at' => $newEndsAt,
                        'updated_at' => Carbon::now()
                    ]);
                }

                Log::info('Extended existing overlapping peak zone instead of creating new one', ['zone_id' => $zoneId, 'peak_zone_id' => $overlappingZone->id]);
                return $overlappingZone;
            }


            Log::info('Overlapping peak zone detected, not creating new zone', ['zone_id' => $zoneId]);
            return null;
        }

        return DB::transaction(function () use ($zone, $polygon, $startsAt, $endsAt, $zoneId, $polygonCoordinates, $centerLat, $centerLng, $zoneName, $distancePricePercentage) {
            $this->deactivateOverlappingPeakZones($zone->id, $polygon);
            $peakZone = PeakZone::create([
                'zone_id' => $zone->id,
                'name' => "Peak Zone {$zoneName} - " . $startsAt->format('YmdHis'),
                'polygon' => $polygon,
                'is_active' => true,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'distance_price_percentage' => $distancePricePercentage,
            ]);
            $peakZone->update(['locations' => $polygonCoordinates]);

            $geohash = (new Geohash())->encode($centerLat, $centerLng, 12);
            $this->fireStoreAddDocument("peak_zones/{$zoneId}/active", [
                'id' => (string)$peakZone->id,
                'name' => $peakZone->name,
                'active' => true,
                'g' => $geohash,
                'start_time' => $startsAt->format('H:i:s'),
                'start_time_timestamp' => $startsAt->timestamp,
                'end_time' => $endsAt->format('H:i:s'),
                'end_time_timestamp' => $endsAt->timestamp,
                'coordinates' => $polygonCoordinates,
                'updated_at' => $startsAt->format('Y-m-d\TH:i:s.v\Z'),
            ], (string)$peakZone->id);

            Log::info("Created new peak zone", ['zone_id' => $peakZone->id]);
            return $peakZone;
        });
    }

    /**
     * Find the most relevant active peak zone for a location.
     */
    protected function findActivePeakZone(float $lat, float $lng, int $zoneId): ?PeakZone
    {
        return PeakZone::where('zone_id', $zoneId)
            ->where('is_active', true)
            ->whereNotNull('polygon')
            ->whereRaw('ST_Contains(ST_SRID(polygon, 4326), ST_GeomFromText(?, 4326))', ["POINT($lat $lng)"])
            ->where(function ($q) use ($zoneId) {
                $q->where(function ($subQ) {
                    $subQ->where('starts_at', '<=', Carbon::now())
                         ->where('ends_at', '>=', Carbon::now());
                })->orWhere(function ($subQ) use ($zoneId) {
                    $subQ->whereNull('starts_at')
                         ->whereNull('ends_at');

                    $zone = Zone::find($zoneId);
                    $minutesActive = $zone ? $zone->minutes_peak_zone_active : 60;
                    $subQ->where('created_at', '>=', Carbon::now()->subMinutes($minutesActive));
                });
            })
            ->orderBy('starts_at', 'desc')
            ->first();
    }

    /**
     * Apply peak zone pricing and return peak zone instance.
     */
    protected function getPeakZones($coordinates)
    {
        $pickup = $coordinates[0] ?? [];
        if (empty($pickup)) {
            Log::warning('getPeakZone: Empty pickup coordinates');
            return null;
        }

        $zone = getZoneByPoint($pickup['lat'], $pickup['lng'])?->first();
        if (!$zone) {
            Log::warning('getPeakZone: No zone found', ['lat' => $pickup['lat'], 'lng' => $pickup['lng']]);
            return null;
        }

        if (!$zone->peak_price_increase_percentage) {
            return null;
        }

        $peakZone = $this->findActivePeakZone($pickup['lat'], $pickup['lng'], $zone->id);
        Log::info("findActivePeakZone", ["peakzone" => $peakZone]);
        if (!$peakZone) {
            $peakZone = $this->validateAndGeneratePeakZone($pickup['lat'], $pickup['lng'], $zone->id, config('app.timezone'));
        }
        Log::info("validateAndGeneratePeakZone", ["peakzone" => $peakZone]);


        // Double-check that the peak zone is still active
        if ($peakZone) {
            $peakZone->refresh();
            $isActive = $peakZone->isActiveNow();
            if (!$isActive) {
                Log::warning('getPeakZone: Peak zone not active now', ['peak_zone_id' => $peakZone->id ?? 'none']);
                return null;
            }
        }

        return $peakZone;
    }

    /**
     * Calculate earnings for a peak zone.
     */
    protected function calculatePeakZoneEarnings(int $peakZoneId, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $peakZone = PeakZone::findOrFail($peakZoneId);
        $query = Ride::where('peak_zone_id', $peakZoneId)->where('payment_status', 'COMPLETED');

        if ($from) $query->where('start_time', '>=', $from);
        if ($to) $query->where('start_time', '<=', $to);

        $surgeSum = $query->sum('peak_zone_charge');

        return [
            'peak_zone_id' => $peakZoneId,
            'peak_zone_name' => $peakZone->name,
            'zone_id' => $peakZone->zone_id,
            'zone_name' => $peakZone->zone->name ?? 'Unknown',
            'total_surge_charges' => round($surgeSum, 2),
            'platform_earnings' => round($surgeSum * 0.2, 2),
            'ride_count' => $query->count(),
        ];
    }
}
