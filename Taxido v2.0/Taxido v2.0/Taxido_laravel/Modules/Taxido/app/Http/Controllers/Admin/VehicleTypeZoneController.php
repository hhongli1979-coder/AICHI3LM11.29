<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Zone;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Repositories\Admin\VehicleTypeZoneRepository;
use Modules\Taxido\Http\Requests\Admin\GetIncentiveDataRequest;
use Modules\Taxido\Http\Requests\Admin\SaveIncentiveConfigurationRequest;
use Modules\Taxido\Http\Requests\Admin\DeleteIncentiveLevelRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VehicleTypeZoneController extends Controller
{
    public $repository;

    /**
     * Display a listing of the resource.
     */
    public function __construct(VehicleTypeZoneRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index($vehicleTypeId)
    {
        $vehicleType = VehicleType::findOrFail($vehicleTypeId);
        return view('taxido::admin.vehicle-zones.index', ['vehicleTypeZones' => VehicleTypeZone::where('vehicle_type_id', $vehicleTypeId)->get(), 'vehicleTypeId' => $vehicleTypeId,  'vehicleName' => $vehicleType->name,'zones' => Zone::all()]);
    }

    public function vehicleZonePriceIndex($vehicleTypeId, $zoneId)
    {
        return $this->repository->vehicleZonePriceIndex($vehicleTypeId, $zoneId);
    }

    public function vehicleZonePriceShow($vehicleTypeId, $zoneId)
    {
        return $this->repository->vehicleZonePriceShow($vehicleTypeId, $zoneId);
    }

    public function vehicleZonePriceStore(Request $request)
    {
        return $this->repository->vehicleZonePriceStore($request);
    }

    public function vehicleZonePriceUpdate(Request $request, VehicleTypeZone $vehicleTypeZone)
    {
        return $this->repository->vehicleZonePriceUpdate($request, $vehicleTypeZone);
    }

    public function updatePreferences(Request $request, VehicleTypeZone $vehicleTypeZone)
    {
        $request->validate([
            'allow_preference' => 'required|boolean',
            'preferences' => 'required_if:allow_preference,1|array',
            'preferences.*.preference_id' => 'required_if:allow_preference,1|exists:preferences,id',
            'preferences.*.price' => 'required_if:allow_preference,1|numeric|min:0'
        ]);

        $vehicleTypeZone->update([
            'allow_preference' => $request->boolean('allow_preference')
        ]);

        if ($request->boolean('allow_preference')) {
            $preferences = collect($request->input('preferences'))->mapWithKeys(function ($item) {
                return [$item['preference_id'] => ['price' => $item['price']]];
            });

            $vehicleTypeZone->preferences()->sync($preferences);
        } else {
            $vehicleTypeZone->preferences()->detach();
        }

        return response()->json(['message' => __('Preferences updated successfully')]);
    }

    /**
     * Get incentive data for a specific vehicle type zone
     *
     * @param GetIncentiveDataRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIncentiveData(GetIncentiveDataRequest $request)
    {
        try {
            $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $request->get('vehicle_type_id'))
                ->where('zone_id', $request->get('zone_id'))
                ->first();

            if (!$vehicleTypeZone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle type zone configuration not found. Please configure pricing first.',
                    'error_code' => 'VEHICLE_TYPE_ZONE_NOT_FOUND'
                ], 404);
            }

            // Get incentive levels grouped by period type
            $dailyLevels = $vehicleTypeZone->getIncentiveLevelsByPeriod('daily');
            $weeklyLevels = $vehicleTypeZone->getIncentiveLevelsByPeriod('weekly');

            return response()->json([
                'success' => true,
                'data' => [
                    'vehicle_type_zone_id' => $vehicleTypeZone->id,
                    'daily_levels' => $dailyLevels->map(function ($level) {
                        return [
                            'id' => $level->id,
                            'level_number' => $level->level_number,
                            'target_rides' => $level->target_rides,
                            'incentive_amount' => number_format($level->incentive_amount, 2),
                            'is_active' => $level->is_active,
                        ];
                    }),
                    'weekly_levels' => $weeklyLevels->map(function ($level) {
                        return [
                            'id' => $level->id,
                            'level_number' => $level->level_number,
                            'target_rides' => $level->target_rides,
                            'incentive_amount' => number_format($level->incentive_amount, 2),
                            'is_active' => $level->is_active,
                        ];
                    }),
                    'has_incentives' => $vehicleTypeZone->hasIncentiveLevels(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching incentive data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while fetching incentive data. Please try again.',
                'error_code' => 'FETCH_INCENTIVE_DATA_ERROR'
            ], 500);
        }
    }

    /**
     * Save incentive configuration for a vehicle type zone
     *
     * @param SaveIncentiveConfigurationRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveIncentiveConfiguration(SaveIncentiveConfigurationRequest $request)
    {
        try {
            // Find vehicle type zone
            $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $request->get('vehicle_type_id'))
                ->where('zone_id', $request->get('zone_id'))
                ->first();

            if (!$vehicleTypeZone) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle type zone configuration not found. Please configure pricing first.',
                    'error_code' => 'VEHICLE_TYPE_ZONE_NOT_FOUND'
                ], 404);
            }

            DB::beginTransaction();

            // Remove existing levels for this period type
            IncentiveLevel::where('vehicle_type_zone_id', $vehicleTypeZone->id)
                ->where('period_type', $request->get('period_type'))
                ->delete();

            // Create new levels
            $createdLevels = [];
            foreach ($request->get('levels') as $levelData) {
                $level = IncentiveLevel::create([
                    'vehicle_type_zone_id' => $vehicleTypeZone->id,
                    'period_type' => $request->get('period_type'),
                    'level_number' => $levelData['level_number'],
                    'target_rides' => $levelData['target_rides'],
                    'incentive_amount' => $levelData['incentive_amount'],
                    'is_active' => true,
                ]);

                $createdLevels[] = [
                    'id' => $level->id,
                    'level_number' => $level->level_number,
                    'target_rides' => $level->target_rides,
                    'incentive_amount' => number_format($level->incentive_amount, 2),
                    'is_active' => $level->is_active,
                ];
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Incentive configuration saved successfully',
                'data' => [
                    'period_type' => $request->get('period_type'),
                    'levels' => $createdLevels
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error saving incentive configuration', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while saving incentive configuration. Please try again.',
                'error_code' => 'SAVE_INCENTIVE_CONFIG_ERROR'
            ], 500);
        }
    }

    /**
     * Delete a specific incentive level
     *
     * @param DeleteIncentiveLevelRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteIncentiveLevel(DeleteIncentiveLevelRequest $request)
    {
        try {
            $incentiveLevel = IncentiveLevel::findOrFail($request->get('level_id'));

            // Check if this level has any associated progress or earned incentives
            $hasProgress = $incentiveLevel->driverProgress()->exists();
            $hasEarnedIncentives = $incentiveLevel->incentives()->exists();

            if ($hasProgress || $hasEarnedIncentives) {
                // Instead of deleting, mark as inactive
                $incentiveLevel->update(['is_active' => false]);
                $message = 'Incentive level deactivated successfully (has associated data)';
            } else {
                // Safe to delete
                $incentiveLevel->delete();
                $message = 'Incentive level deleted successfully';
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting incentive level', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while deleting incentive level. Please try again.',
                'error_code' => 'DELETE_INCENTIVE_LEVEL_ERROR'
            ], 500);
        }
    }
}
