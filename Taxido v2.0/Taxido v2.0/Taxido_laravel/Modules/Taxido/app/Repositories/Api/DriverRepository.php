<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Models\Document;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Ambulance;
use Illuminate\Support\Facades\Hash;
use Modules\Taxido\Models\VehicleInfo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use Modules\Taxido\Http\Traits\RideTrait;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Resources\FleetManagers\DriverResource;

class DriverRepository extends BaseRepository
{
    use RideTrait;

    public function model()
    {
        return Driver::class;
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function driverZone($request)
    {
        DB::beginTransaction();
        try {

            $zoneIds = [];
            $isValid = false;
            $locations = $request->locations;
            if(is_array($locations)) {
                $locate = head($locations);
                if((!is_null($locate['lat']) && !is_null($locate['lng']))) {
                    $isValid = true;
                }
            }

            if($isValid) {
                $driver = getCurrentDriver();
                if ($driver) {
                    $driver->update([
                        'is_online' => $request->is_online,
                        'location' => $request->locations,
                    ]);

                    foreach ($locations as $location) {
                        $zones = getZoneByPoint($location['lat'], $location['lng']);
                        if (!$zones->isEmpty()) {
                            foreach ($zones as $zone) {
                                $zoneIds[] = $zone?->id;
                            }
                        }
                    }

                    if (!empty($zoneIds)) {
                        $driver->zones()->sync([]);
                        $driver->zones()->sync(array_unique($zoneIds));
                    }

                    DB::commit();
                    return [
                        'success' => true,
                    ];
                }
            }

            DB::rollback();
            return [
                'success' => false,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getAmbulance($request)
    {
        try {

            if($request->lat && $request->lng) {
                $driverIds = $this->findNearestDrivers($request->lat, $request->lng);
                return Ambulance::whereNull('deleted_at')?->whereIn('driver_id', $driverIds)?->simplePaginate();
            }

            throw new Exception("lat and lng field is required.", 422);


        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getNearestDrivers($request)
    {
        try {

            $zoneIds = [];
            $drivers = $this->model;
            if($request->lat && $request->lng) {
                $zones = getZoneByPoint($request->lat, $request->lng);
                if (!$zones->isEmpty()) {
                    foreach ($zones as $zone) {
                        $zoneIds[] = $zone?->id;
                    }
                }
            }

            if ($request?->service_id) {
                $drivers = $drivers?->where('service_id', $request?->service_id);
            }

            if ($request?->service_category_id) {
                $drivers = $drivers?->where('service_category_id', $request?->service_category_id);
            }

            $driverIds = $drivers?->pluck('id')?->toArray();
            if ($request?->vehicle_type_id) {
                $vehicleTypeId = $request?->vehicle_type_id;
                $drivers = $drivers?->whereHas('vehicle_info', function (Builder $vehicleInfo) use ($vehicleTypeId) {
                    $vehicleInfo->where('vehicle_type_id', $vehicleTypeId);
                });
            }

            return Ambulance::whereNull('deleted_at')?->whereIn('driver_id', $driverIds)?->simplePaginate();

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fleetDriverRegister($request)
    {
        DB::beginTransaction();
        try {

            $roleName = getCurrentRoleName();
            if($roleName != RoleEnum::FLEET_MANAGER) {
                throw new Exception("Only fleet manager can create a driver.", 403);
            }

            $validator = Validator::make($request->all(), [
                'name'                  => 'required',
                'email'                 => 'required|string|email|max:255',
                'password'              => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required',
                'country_code'          => 'required',
                'phone'                 => 'required|min:6|max:15',
                'vehicle_info_id'       => 'required|exists:vehicle_info,id,deleted_at,NULL',
                'documents'             => 'array|required',
                'documents.*.slug'      => 'exists:documents,slug,deleted_at,NULL|required',
                'service_id'            => 'required|exists:services,id,deleted_at,NULL',
                'service_category_id'   => 'nullable|exists:service_categories,id,deleted_at,NULL',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $taxidoSettings = getTaxidoSettings();
            $driverIsVerified = 0;
            if (!$taxidoSettings['activation']['driver_verification']) {
                $driverIsVerified = 1;
            }

            $driver = $this->model->create([
                'name'                => $request->name,
                'email'               => $request->email,
                'country_code'        => $request->country_code,
                'phone'               => (string) $request->phone,
                'service_id'          => $request->service_id,
                'service_category_id' => $request->service_category_id,
                'fleet_manager_id'    => getCurrentUserId(),
                'password'            => Hash::make($request->password),
                'is_verified'         => $driverIsVerified,
            ]);

            $driver->assignRole(RoleEnum::DRIVER);
            $driver->wallet()->create();
            $driver->wallet;

            if($request->vehicle_info_id) {
                $vehicleInfo = VehicleInfo::where('id', $request->vehicle_info_id)?->where('fleet_manager_id', getCurrentUserId())?->first();
                if(!$vehicleInfo){
                    throw new Exception("Selected vehicle is invalid for current fleet manager.", 422);
                }

                $vehicleInfo->update([
                    'driver_id' => $driver?->id,
                ]);
            }

            if (!empty($request->documents) && is_array($request->documents)) {
                if (count($request->documents)) {
                    foreach ($request->documents as $document) {
                        if (is_array($document)) {
                            $attachmentObj = createAttachment();
                            $attachment_id = addMedia($attachmentObj, $document['file'])?->id;
                            $attachmentObj?->delete();
                            $doc = Document::where('slug', $document['slug'])->first();
                            $expired_at = $document['expired_at'] ?? null;
                            if ($doc?->need_expired_date) {
                                if (! $expired_at) {
                                    throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                                }
                            }

                            $driver->documents()?->create([
                                'document_id'       => $doc?->id,
                                'document_image_id' => $attachment_id,
                                'expired_at'        => $expired_at,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            $driver = $driver->refresh();
            $this->updateDriverInFirebase($driver);
            return new DriverResource($driver);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fleetDriverUpdate($request)
    {
        DB::beginTransaction();
        try {

            $roleName = getCurrentRoleName();
            if($roleName != RoleEnum::FLEET_MANAGER) {
                throw new Exception("Only fleet manager can update a driver.", 403);
            }

            $validator = Validator::make($request->all(), [
                'driver_id'             => 'required|exists:users,id,deleted_at,NULL',
                'name'                  => 'sometimes|required|string',
                'email'                 => 'sometimes|nullable|string|email|max:255|unique:users,email,' . ($request->driver_id ?? 'NULL') . ',id,deleted_at,NULL',
                'country_code'          => 'sometimes|required',
                'phone'                 => 'sometimes|required|min:6|max:15',
                'vehicle_info_id'       => 'sometimes|nullable|exists:vehicle_info,id,deleted_at,NULL',
                'documents.*.slug'      => 'sometimes|exists:documents,slug,deleted_at,NULL',
                'service_id'            => 'sometimes|exists:services,id,deleted_at,NULL',
                'service_category_id'   => 'sometimes|nullable|exists:service_categories,id,deleted_at,NULL',
                'profile_image_id'      => 'sometimes|nullable|exists:attachments,id,deleted_at,NULL',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $driver = $this->model->findOrFail($request->driver_id);
            if ($driver->fleet_manager_id != getCurrentUserId()) {
                throw new Exception("You can only update your own drivers.", 403);
            }

            $driver->update($request->all());
            if ($request->vehicle_info_id) {
                $vehicleInfo = VehicleInfo::where('id', $request->vehicle_info_id)?->where('fleet_manager_id', getCurrentUserId())?->first();
                if(!$vehicleInfo){
                    throw new Exception("Selected vehicle is invalid for current fleet manager.", 422);
                }

                $vehicleInfo->update([
                    'driver_id' => $driver?->id,
                ]);
            }

            if (!empty($request->documents) && is_array($request->documents)) {
                foreach ($request->documents as $document) {
                    if (is_array($document)) {
                        $doc  = Document::where('slug', $document['slug'])->first();
                        if ($doc) {
                            $attachmentId = null;
                            if (!empty($document['file'])) {
                                $attachmentObj = createAttachment();
                                $attachmentId = addMedia($attachmentObj, $document['file'])?->id;
                                $attachmentObj?->delete();
                            }
                            $expired_at = $document['expired_at'] ?? null;
                            if ($doc?->need_expired_date && ! $expired_at) {
                                throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                            }

                            $payload = [
                                'expired_at' => $expired_at,
                            ];
                            if ($attachmentId) {
                                $payload['document_image_id'] = $attachmentId;
                            }

                            $driver->documents()?->updateOrCreate([
                                'document_id' => $doc?->id,
                            ], $payload);
                        }
                    }
                }
            }

            DB::commit();
            $driver = $driver->fresh();
            $this->updateDriverInFirebase($driver);
            return new DriverResource($driver);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fleetDriverDelete($driverId)
    {
        DB::beginTransaction();
        try {

            $roleName = getCurrentRoleName();
            if($roleName != RoleEnum::FLEET_MANAGER) {
                throw new Exception("Only fleet manager can delete a driver.", 403);
            }

            $driver = $this->model->findOrFail($driverId);
            if ($driver->fleet_manager_id != getCurrentUserId()) {
                throw new Exception("You can only delete your own drivers.", 403);
            }

            $driver->delete();
            $this->fireStoreDeleteDocument('driverTrack', (string) $driver->id);

            DB::commit();
            return [
                'success' => true,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    protected function updateDriverInFirebase($driver): void
    {
        try {

            if($driver) {
                $firebaseData = [
                    'driver_id'   => (string) $driver->id,
                    'driver_name' => $driver->name,
                    'phone' => $driver->phone,
                    'is_online'   => $driver->is_online ? "1" : "0",
                    'service_id' => $driver->service_id,
                    'service_category_id' => $driver->service_category_id,
                    'fleet_manager_id'  => $driver->fleet_manager_id,
                    'vehicle_type_id' => $driver->vehicle_type_id,
                    'is_verified' => $driver->is_verified ? 1 : 0,
                    'is_on_ride' => $driver->is_on_ride ? "1" : "0",
                    'status'      => $driver->status ? "1" : "0",
                ];

                if ($driver->profile_image) {
                    $firebaseData['profile_image_url'] = $driver?->profile_image?->original_url;
                }

                if ($driver?->vehicle_info) {
                    $firebaseData['model']         = $driver?->vehicle_info?->model;
                    $firebaseData['vehicle_model'] = $driver?->vehicle_info?->model;
                    if ($driver->vehicle_info->vehicle) {
                        $firebaseData['vehicle_name'] = $driver?->vehicle_info->vehicle?->name;
                        $firebaseData['vehicle_map_icon_url'] = $driver?->vehicle_info?->vehicle?->vehicle_map_icon?->original_url;
                        $firebaseData['vehicle_type_id'] = $driver?->vehicle_info?->vehicle?->id;
                    }
                }

                $location = $driver->location ?? null;
                if ($location && isset($location[0]['lat']) && isset($location[0]['lng'])) {
                    $firebaseData['lat'] = $location[0]['lat'];
                    $firebaseData['lng'] = $location[0]['lng'];
                }

                $this->fireStoreUpdateDocument('driverTrack', (string) $driver->id, $firebaseData, true);
            }

        } catch (Exception $e) {

            throw new ExceptionHandler("Failed to update driver in Firebase: {$e->getMessage()}", $e->getCode());
        }
    }
}
