<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Zone;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Prettus\Repository\Eloquent\BaseRepository;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Objects\LineString;

class ZoneRepository extends BaseRepository
{
    public function model()
    {
        return Zone::class;
    }

    public function index($zoneTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.zone.index', ['tableConfig' => $zoneTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $coordinates = json_decode($request?->place_points ?? '', true);

            $points = array_map(function ($coordinate) {
                return new Point($coordinate['lat'], $coordinate['lng']);
            }, $coordinates);

            if (head($points) != end($points)) {
                $points[] = head($points);
            }

            $lineString   = new LineString($points);
            $place_points = new Polygon([$lineString]);
            $wkt = $place_points->toWkt();
            $conflict = $this->model->whereNull('deleted_at')
                    ->where(function ($query) use ($wkt) {
                        $query->whereRaw("ST_Overlaps(place_points, ST_GeomFromText(?))", [$wkt])
                            ->orWhereRaw("ST_Contains(place_points, ST_GeomFromText(?))", [$wkt])
                            ->orWhereRaw("ST_Contains(ST_GeomFromText(?), place_points)", [$wkt]);
                    })->first();

            if ($conflict) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['place_points' => "Conflict with existing zone: {$conflict->name}. You cannot create overlapping or contained zones."]);
            }

            $zone = $this->model->create([
                'name'           => $request->name,
                'amount'         => $request->amount,
                'distance_type'  => $request->distance_type,
                'payment_method' => $request->payment_method,
                'currency_id'    => $request->currency_id,
                'place_points'   => $place_points,
                'locations'      => $coordinates,
                'weight_unit'      => $request->weight_unit,
                'status'         => $request->status,
                'name'           => $request->name,
                'peak_zone_geographic_radius' => $request->peak_zone_geographic_radius,
                'minutes_choosing_peak_zone'  => $request->minutes_choosing_peak_zone,
                'minutes_choosing_peak_zone' => $request->minutes_choosing_peak_zone,
                'minutes_peak_zone_active'  => $request->minutes_peak_zone_active,
                'peak_price_increase_percentage' => $request->peak_price_increase_percentage,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $zone->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.zone.edit', ['zone' => $zone->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.zones.created'));
            }

            return to_route('admin.zone.index')->with('success', __('taxido::static.zones.created'));
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $zone   = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $zone->setTranslation('name', $locale, $request['name']);

            if (isset($request['place_points'])) {
                $coordinates = json_decode($request['place_points'] ?? '', true);

                if ($this->coordinatesChanged($zone->locations, $coordinates)) {
                    $points = array_map(function ($coordinate) {
                        return new Point($coordinate['lat'], $coordinate['lng']);
                    }, $coordinates);

                    if (head($points) != end($points)) {
                        $points[] = head($points);
                    }

                    $lineString   = new LineString($points);
                    $place_points = new Polygon([$lineString]);
                    $wkt          = $place_points->toWkt();
                    $conflict = $this->model->whereNull('deleted_at')
                        ->where('id', '!=', $zone->id)
                        ->where(function ($query) use ($wkt) {
                            $query->whereRaw("ST_Overlaps(place_points, ST_GeomFromText(?))", [$wkt])
                                ->orWhereRaw("ST_Contains(place_points, ST_GeomFromText(?))", [$wkt])
                                ->orWhereRaw("ST_Contains(ST_GeomFromText(?), place_points)", [$wkt]);
                        })->first();

                    if ($conflict) {
                        return redirect()->back()
                            ->withInput()
                            ->withErrors(['place_points' => "Conflict with existing zone: {$conflict->name}. You cannot overlap with other zones."]);
                    }

                    $zone->place_points = $place_points;
                    $zone->locations    = $coordinates;
                }
            }

            $zone->payment_method = $request['payment_method'] ?? $zone->payment_method;
            $zone->amount         = $request['amount'] ?? $zone->amount;
            $zone->distance_type  = $request['distance_type'] ?? $zone->distance_type;
            $zone->weight_unit      = $request['weight_unit'] ?? $zone->weight_unit;
            $zone->currency_id    = $request['currency_id'] ?? $zone->currency_id;
            $zone->status         = $request['status'] ?? $zone->status;

            $zone->total_rides_in_peak_zone  = $request['total_rides_in_peak_zone'] ?? $zone->total_rides_in_peak_zone;
            $zone->peak_zone_geographic_radius  = $request['peak_zone_geographic_radius'] ?? $zone->peak_zone_geographic_radius;
            $zone->minutes_choosing_peak_zone      = $request['minutes_choosing_peak_zone'] ?? $zone->minutes_choosing_peak_zone;
            $zone->minutes_peak_zone_active    = $request['minutes_peak_zone_active'] ?? $zone->minutes_peak_zone_active;
            $zone->peak_price_increase_percentage         = $request['peak_price_increase_percentage'] ?? $zone->peak_price_increase_percentage;

            $zone->save();

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.zone.edit', ['zone' => $zone->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.zones.updated'));
            }

            return to_route('admin.zone.index')->with('success', __('taxido::static.zones.updated'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Check if coordinates have actually changed
     */
    protected function coordinatesChanged($existing, $new)
    {
        if (count($existing) !== count($new)) {
            return true;
        }

        foreach ($existing as $i => $point) {
            if (abs($point['lat'] - $new[$i]['lat']) > 0.000001 ||
                abs($point['lng'] - $new[$i]['lng']) > 0.000001) {
                return true;
            }
        }
        return false;
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $zone = $this->model->findOrFail($id);
            $zone->destroy($id);

            DB::commit();
            return redirect()->back()->with('success', __('taxido::static.zones.deleted'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $zone = $this->model->findOrFail($id);
            $zone->update(['status' => $status]);

            return json_encode(['resp' => $zone]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $zone = $this->model->onlyTrashed()->findOrFail($id);
            $zone->restore();
            return redirect()->back()->with('success', __('taxido::static.zones.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $zone = $this->model->findOrFail($id);
            $zone->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.zones.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAll($ids)
    {
        DB::beginTransaction();
        try {

            $this->model->whereNot('system_reserve', true)->whereIn('id', $ids)?->delete();

            DB::commit();
            return back()->with('success', __('taxido::static.zones.deleted'));
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
