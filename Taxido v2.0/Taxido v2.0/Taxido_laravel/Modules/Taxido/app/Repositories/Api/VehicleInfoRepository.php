<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Document;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Models\VehicleInfoDoc;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class VehicleInfoRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name' => 'like',
    ];

    function model()
    {
        return VehicleInfo::class;
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

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $taxidoSettings = getTaxidoSettings();
            $fleetVehicleIsVerified = 0;
            if (! $taxidoSettings['activation']['fleet_vehicle_verification']) {
                $fleetVehicleIsVerified = 1;
            }

            $vehicleInfo = $this->model->create([
                'name'                => $request->name,
                'vehicle_type_id'     => $request->vehicle_type_id,
                'color'               => $request->color,
                'model'               => $request->model,
                'fleet_manager_id'    => getCurrentUserId(),
                'model_year'          => $request?->model_year,
                'plate_number'        => $request->plate_number,
            ]);

            if (!empty($request->documents) && is_array($request->documents)) {
                if (count($request->documents)) {
                    foreach ($request->documents as $document) {
                        if (is_array($document)) {
                            $attachmentObj = createAttachment();
                            $attachment_id = addMedia($attachmentObj, $document['file'])?->id;
                            $attachmentObj?->delete();
                            $doc = Document::where('slug', $document['slug'])?->where('type', 'vehicle')->first();
                            if($doc) {
                                $expired_at = $document['expired_at'] ?? null;
                                if ($doc?->need_expired_date) {
                                    if (! $expired_at) {
                                        throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                                    }
                                }

                                $vehicleInfo->documents()?->create([
                                    'document_id'       => $doc?->id,
                                    'document_image_id' => $attachment_id,
                                    'fleet_manager_id' => getCurrentUserId(),
                                    'expired_at'        => $expired_at,
                                    'status'            => $fleetVehicleIsVerified ? 'approved' : 'pending'
                                ]);
                            }
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(['id' => $vehicleInfo?->id]);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

     public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $roleName = getCurrentRoleName();
            if($roleName == RoleEnum::RIDER || $roleName == RoleEnum::DISPATCHER) {
                throw new Exception("unauthorized", 403);
            }

            $vehicleInfo = $this->model->findOrFail($id);
            if($roleName == RoleEnum::FLEET_MANAGER) {
                if($vehicleInfo->fleet_manager_id != getCurrentUserId()) {
                    throw new Exception("unauthorized", 403);
                }
            }
            $vehicleInfo->update($request);
            foreach ($request['documents'] as $doc) {
                if(isset($doc['slug'])) {
                    $document  = Document::where('slug', $doc['slug'])?->where('type', 'vehicle')?->where('status', true)?->whereNull('deleted_at')->first();
                    if (! empty($doc['file'])) {
                        $attachmentId = addMedia(createAttachment(), $doc['file'])?->id;
                    }

                    if($document) {
                        $vehicleInfoDoc = VehicleInfoDoc::where('vehicle_info_id', $id)->where('document_id', $document?->id)?->whereNull('deleted_at')->first();
                        if($vehicleInfoDoc) {
                            $vehicleInfoDoc->update([
                                'document_id'       => $document?->id,
                                'type'              => $document?->type,
                                'expired_at'        => $doc['expired_at'] ?? $vehicleInfoDoc?->expired_at,
                                'document_image_id' => $attachmentId,
                                'status'            => 'pending'
                            ]);
                        } else {

                            VehicleInfoDoc::create([
                                'vehicle_info_id'   => $id,
                                'fleet_manager_id'  => $vehicleInfo?->fleet_manager_id,
                                'document_id'       => $document?->id,
                                'type'              => $document?->type,
                                'expired_at'        => $doc['expired_at'] ?? $vehicleInfoDoc?->expired_at,
                                'document_image_id' => $attachmentId,
                                'status'            => 'pending'
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json(['id' => $vehicleInfo?->id]);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

           return $this->model->where('id', $id)?->delete();

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
