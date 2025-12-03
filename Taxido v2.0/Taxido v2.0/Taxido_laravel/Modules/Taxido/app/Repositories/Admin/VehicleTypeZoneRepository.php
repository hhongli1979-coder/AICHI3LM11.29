<?php

namespace Modules\Taxido\Repositories\Admin;

use Illuminate\Support\Facades\Validator;
use Modules\Taxido\Models\VehicleTypeZone;
use Prettus\Repository\Eloquent\BaseRepository;

class VehicleTypeZoneRepository extends BaseRepository
{
    public function model()
    {
        return VehicleTypeZone::class;
    }

    public function index($vehicleTypeId)
    {
        return VehicleTypeZone::where('vehicle_type_id', $vehicleTypeId)->with('zone')->get();
    }

    public function vehicleZonePriceIndex($vehicleTypeId, $zoneId)
    {
        return VehicleTypeZone::where('vehicle_type_id', $vehicleTypeId)->with(['preferences'])->where('zone_id', $zoneId)->with('zone')->get();
    }

    public function vehicleZonePriceShow($vehicleTypeId, $zoneId)
    {
        $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $vehicleTypeId)
            ->with(['preferences'])
            ->where('zone_id', $zoneId)
            ->first();

        return response()->json([
            'success' => true,
            'vehicleTypeZone' => $vehicleTypeZone
        ]);
    }

    public function vehicleZonePriceStore($request)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'zone_id' => 'required|exists:zones,id',
            'base_fare_charge' => 'required|numeric|min:0',
            'base_distance' => 'required|numeric|min:0',
            'is_allow_tax' => 'required|boolean',
            'tax_id' => 'nullable|exists:taxes,id',
            'per_distance_charge' => 'required|numeric|min:0',
            'per_minute_charge' => 'required|numeric|min:0',
            'per_weight_charge' => 'nullable|numeric|min:0',
            'waiting_charge' => 'nullable|numeric|min:0',
            'free_waiting_time_before_start_ride' => 'nullable|numeric|min:0',
            'free_waiting_time_after_start_ride' => 'nullable|numeric|min:0',
            'is_allow_airport_charge' => 'required|boolean',
            'cancellation_charge_for_rider' => 'nullable|numeric|min:0',
            'cancellation_charge_for_driver' => 'nullable|numeric|min:0',
            'charge_goes_to' => 'required|in:rider,driver,admin',
            'airport_id' => 'nullable|exists:airports,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('preferences');
        $data['is_allow_preference'] = $request->input('is_allow_preference', false);
        $vehicleTypeZone = VehicleTypeZone::create($data);

        // Sync preferences
        if ($request->has('preferences') && $data['allow_preference']) {
            $preferences = collect($request->preferences)->mapWithKeys(function ($item) {
                return [$item['id'] => ['price' => $item['price']]];
            })->toArray();
            $vehicleTypeZone->preferences()->sync($preferences);
        } else {
            $vehicleTypeZone->preferences()->detach();
        }

        return response()->json([
            'success' => true,
            'vehicleTypeZone' => $vehicleTypeZone
        ]);
    }

    public function vehicleZonePriceUpdate($request, $vehicleTypeZone)
    {
        $validator = Validator::make($request->all(), [
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'zone_id' => 'required|exists:zones,id',
            'base_fare_charge' => 'required|numeric|min:0',
            'base_distance' => 'required|numeric|min:0',
            'is_allow_tax' => 'required|boolean',
            'per_distance_charge' => 'required|numeric|min:0',
            'per_minute_charge' => 'required|numeric|min:0',
            'per_weight_charge' => 'nullable|numeric|min:0',
            'waiting_charge' => 'nullable|numeric|min:0',
            'free_waiting_time_before_start_ride' => 'nullable|numeric|min:0',
            'free_waiting_time_after_start_ride' => 'nullable|numeric|min:0',
            'is_allow_airport_charge' => 'required|boolean',
            'cancellation_charge_for_rider' => 'nullable|numeric|min:0',
            'cancellation_charge_for_driver' => 'nullable|numeric|min:0',
            'charge_goes_to' => 'required|in:rider,driver,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('preferences');
        $data['is_allow_preference'] = $request->input('is_allow_preference', false);
        $vehicleTypeZone->update($data);

        // Sync preferences
        if ($request->has('preferences') && $data['is_allow_preference']) {
            $preferences = collect($request->input('preferences'))->mapWithKeys(function ($item) {
                return [$item['id'] => ['price' => $item['price']]];
            })->toArray();
            $vehicleTypeZone->preferences()->sync($preferences);
        } else {
            $vehicleTypeZone->preferences()->detach();
        }

        return response()->json([
            'success' => true,
            'vehicleTypeZone' => $vehicleTypeZone
        ]);
    }
}
