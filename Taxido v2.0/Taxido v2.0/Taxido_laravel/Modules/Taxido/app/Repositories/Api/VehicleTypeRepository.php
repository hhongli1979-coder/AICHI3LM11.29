<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\VehicleType;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Models\VehicleTypeZone;
use Modules\Taxido\Http\Traits\BiddingTrait;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Http\Resources\Riders\VehicleTypeResource;

class VehicleTypeRepository extends BaseRepository
{
    use BiddingTrait;

    protected $fieldSearchable = [
        'name' => 'like',
    ];

    function model()
    {
        return VehicleType::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (ExceptionHandler $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getVehicleTypeByLocations($request)
    {
        try {
            $zoneIds = [];
            $locations = $request->locations ?? [];
            $serviceId = $request->service_id;

            $serviceCategoryId = $request->service_category_id;
            foreach ($locations as $location) {
                $zones = getZoneByPoint($location['lat'], $location['lng']);
                if (!$zones->isEmpty()) {
                    foreach ($zones as $zone) {
                        $zoneIds[] = $zone?->id;
                    }
                }
            }

            if (empty($zoneIds)) {
                throw new Exception(__('taxido::static.vehicle_types.not_found_vehicles_by_points'), 400);
            }

            $vehicleTypes = $this->model->where(function ($query) use ($zoneIds) {
                $query->where('is_all_zones', true)
                    ->orWhere(function ($q) use ($zoneIds) {
                        $q->where('is_all_zones', false)
                            ->where('status', true)
                            ->whereHas('zones', function (Builder $zones) use ($zoneIds) {
                                $zones->select('zones.id')?->whereIn('zones.id', $zoneIds);
                            });
                    });
            });

            if ($serviceId) {
                $vehicleTypes = $vehicleTypes->whereHas('services', function (Builder $service) use ($serviceId) {
                    $service->where('services.id', $serviceId);
                });
            }

            if ($serviceCategoryId) {
                $vehicleTypes = $vehicleTypes->whereHas('service_categories', function (Builder $serviceCategory) use ($serviceCategoryId) {
                    $serviceCategory->where('service_category_id', $serviceCategoryId);
                });
            }

            if ($request->service_category) {
                $service_category = $request->service_category;
                $vehicleTypes = $vehicleTypes->whereHas('service_categories', function (Builder $query) use ($service_category) {
                    $query->where('slug', '=' , $service_category);
                });
            }

            $originLat = head($locations)['lat'];
            $originLng = head($locations)['lng'];
            $zone = getZoneByPoint($originLat, $originLng)?->first();
            $rideDistance = calculateRideDistance($locations, $zone?->distance_type);
            $vehicleTypes = $vehicleTypes?->get() ?? [];
            if($zone && $vehicleTypes) {
                foreach($vehicleTypes as $vehicleType) {
                    $vehicleType->currency_symbol = $zone->currency?->symbol;
                    $vehicleType->currency_code = $zone->currency?->code;
                    $vehicleTypeZone = VehicleTypeZone::where('vehicle_type_id', $vehicleType?->id)?->where('zone_id', $zone?->id)?->first();
                    if($vehicleTypeZone) {
                        $vehicleType->vehicle_type_zone = $vehicleTypeZone;
                        $vehicleTypeZone->weight = $request?->weight;
                        $charge = $this->calVehicleTypeZonePrice($rideDistance, $vehicleTypeZone, $request);
                        $vehicleType->charges = $charge;
                    }
                }
            }

            if($vehicleTypes && $zone) {
                if($request->distance && $request->duration) {
                    foreach($vehicleTypes as $vehicleType) {
                        $distance = str_replace(' KM','',$request->distance);
                        $zone->distance_unit = null;
                        $zone->distance = $distance;
                        $vehicleType->currency_symbol = $zone->currency?->symbol;
                        $vehicleType->currency_code = $zone->currency?->code;
                    }
                }

                $vehicleTypes = $vehicleTypes->filter(function ($vehicleType, $key) {
                    return isset($vehicleType?->charges['total']) ? $vehicleType?->charges['total'] > 0 : false;
                });
            }

            return VehicleTypeResource::collection($vehicleTypes ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
