<?php

namespace Modules\Taxido\Repositories\Admin;

use Modules\Taxido\Models\VehicleSurgePrice;
use Prettus\Repository\Eloquent\BaseRepository;

class VehicleSurgePriceRepository extends BaseRepository
{
    public function model()
    {
        return VehicleSurgePrice::class;
    }

    public function index($vehicleTypeId)
    {
        return VehicleSurgePrice::where('vehicle_type_id', $vehicleTypeId)->with('zone')->get();
    }

    public function VehicleSurgePriceIndex($vehicleTypeId, $zoneId)
    {
        return VehicleSurgePrice::where('vehicle_type_id', $vehicleTypeId)->where('zone_id', $zoneId)->with('zone')->get();
    }

    public function vehicleSurgePriceShow($vehicleTypeId, $zoneId)
    {
        $vehicleSurgePrice = VehicleSurgePrice::where('vehicle_type_id', $vehicleTypeId)->where('zone_id', $zoneId)->first();

        return response()->json([
            'success'           => true,
            'vehicleSurgePrice' => $vehicleSurgePrice,
        ]);
    }

    public function vehicleSurgePriceStore($request)
    {
        $data = $request->all();

        $surgePrices = $data['surge_prices'] ?? [];
        $results = [];


        foreach ($surgePrices as $surgePriceData) {
            $existingRecord = VehicleSurgePrice::where([
                'vehicle_type_id' => $data['vehicle_type_id'],
                'zone_id' => $data['zone_id'],
                'surge_price_id' => $surgePriceData['surge_price_id']
            ])->first();

            if ($existingRecord) {
                $existingRecord->update(['amount' => $surgePriceData['amount']]);
                $results[] = $existingRecord;
            } else {
                $vehicleSurgePrice = VehicleSurgePrice::create([
                    'vehicle_type_id' => $data['vehicle_type_id'],
                    'zone_id' => $data['zone_id'],
                    'surge_price_id' => $surgePriceData['surge_price_id'],
                    'amount' => $surgePriceData['amount']
                ]);
                $results[] = $vehicleSurgePrice;
            }
        }

        return response()->json([
            'success' => true,
            'vehicleSurgePrices' => $results,
        ]);
    }

    public function vehicleSurgePriceUpdate($request, $vehicleSurgePrice)
    {
        $vehicleSurgePrice->update($request->all());

        return response()->json([
            'success' => true,
            'vehicleSurgePrice' => $vehicleSurgePrice,
        ]);
    }
}
