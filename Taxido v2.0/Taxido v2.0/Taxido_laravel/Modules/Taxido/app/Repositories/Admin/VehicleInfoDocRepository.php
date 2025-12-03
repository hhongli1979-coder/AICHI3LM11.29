<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\FireStoreTrait;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Document;
use Modules\Taxido\Models\VehicleInfoDoc;
use Modules\Taxido\Enums\DocumentStatusEnum;
use Modules\Taxido\Models\VehicleInfo;
use Prettus\Repository\Eloquent\BaseRepository;

class VehicleInfoDocRepository extends BaseRepository
{
    use FireStoreTrait;

    function model()
    {
        return VehicleInfoDoc::class;
    }

    public function index($vehicleInfoDocTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.vehicle-info-doc.index', ['tableConfig' => $vehicleInfoDocTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $vehicleInfo = VehicleInfo::whereNull('deleted_at')?->where('id', $request->vehicle_info_id)?->first();
            if(!$vehicleInfo) {
                throw new Exception("Selected vehicle id is invalid", 400);
            }

            $vehicleInfoDoc = $this->model->create([
                'vehicle_info_id' => $vehicleInfo->id,
                'fleet_manager_id' => $vehicleInfo->fleet_manager_id,
                'document_id' => $request->document_id,
                'expired_at' => Carbon::createFromFormat('m/d/Y', $request->expired_at)->format('Y-m-d'),
                'document_image_id' => $request->document_image_id,
                'status' => $request->status,
            ]);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.vehicleInfoDoc.edit', ['fleet_document' => $vehicleInfoDoc->id])
                    ->with('success', __('taxido::static.fleet_vehicle_documents.create_successfully'));
            }

            return to_route('admin.vehicleInfoDoc.index')->with('success', __('taxido::static.fleet_vehicle_documents.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $vehicleInfoDoc = $this->model->findOrFail($id);
            $vehicleInfoDoc->destroy($id);
            return redirect()->route('admin.vehicleInfoDoc.index')->with('success', __('taxido::static.fleet_vehicle_documents.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $vehicleInfoDoc = $this->model->findOrFail($id);
            $vehicleInfoDoc->update(['status' => $status]);

            return json_encode(["resp" => $vehicleInfoDoc]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $vehicleInfoDoc = $this->model->onlyTrashed()->findOrFail($id);
            $vehicleInfoDoc->restore();

            return redirect()->back()->with('success', __('taxido::static.fleet_vehicle_documents.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $vehicleInfoDoc = $this->model->onlyTrashed()->findOrFail($id);
            $vehicleInfoDoc->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.fleet_vehicle_documents.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateStatus($request, $id)
    {
        DB::beginTransaction();
        try {

            $vehicleInfoDoc = $this->model->findOrFail($id);
            $oldStatus = $vehicleInfoDoc->status;

            $vehicleInfoDoc->update([
                'status' => $request['status']
            ]);

            if ($oldStatus !== $request['status']) {
                $fleetManager = $vehicleInfoDoc->fleetManager;
            }

            DB::commit();
            $vehicleInfoDoc = $vehicleInfoDoc->refresh();
            $isVerified = 0;
            if ($this->isVehicleInfoAllDocumentsApproved($vehicleInfoDoc?->vehicle_info_id)) {
                $isVerified = 1;
            }

            $fleetManager = $vehicleInfoDoc?->fleetManager;
            $fleetManager->update([
                'is_verified' => $isVerified,
            ]);

            return redirect()->route('admin.vehicleInfoDoc.index')->with('success', __('taxido::static.documents.status_update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function isVehicleInfoAllDocumentsApproved($vehicle_info_id)
    {
        $totalReqDocument = Document::where('is_required', true)?->where('type', 'vehicle')->whereNull('deleted_at')?->count();
        $totalVehicleInfoDocuments = $this->model->where('vehicle_info_id', $vehicle_info_id)?->whereNull('deleted_at')?->count();
        if($totalVehicleInfoDocuments) {
            if($totalReqDocument) {
                $totalReqApprovedDocuments = $this->model->whereHas('document', function ($document)  {
                    $document->where('is_required', true);
                })->where('vehicle_info_id', $vehicle_info_id)?->whereNull('deleted_at')
                ?->where('status', DocumentStatusEnum::APPROVED)
                ?->count();
            }

            if(!$totalReqDocument) {
                $totalReqApprovedDocuments = $this->model->where('vehicle_info_id', $vehicle_info_id)?->whereNull('deleted_at')
                ?->where('status', DocumentStatusEnum::APPROVED)
                ?->count();
            }

            if($totalReqApprovedDocuments) {
                if($totalReqDocument > 0) {
                    return ($totalReqDocument == $totalReqApprovedDocuments);
                }

                if ($totalReqDocument == 0) {
                    return ($totalVehicleInfoDocuments == $totalReqApprovedDocuments);
                }
            }
        }

        return false;
    }
}
