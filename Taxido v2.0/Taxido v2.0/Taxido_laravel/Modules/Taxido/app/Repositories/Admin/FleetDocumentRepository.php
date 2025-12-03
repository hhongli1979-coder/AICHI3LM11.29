<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\FireStoreTrait;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\DocumentStatusEnum;
use Modules\Taxido\Models\Document;
use Modules\Taxido\Models\FleetDocument;
use Prettus\Repository\Eloquent\BaseRepository;

class FleetDocumentRepository extends BaseRepository
{
    use FireStoreTrait;

    function model()
    {
        return FleetDocument::class;
    }

    public function index($fleetDocumentTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.fleet-document.index', ['tableConfig' => $fleetDocumentTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {
            $fleetDocument = $this->model->create([
                'fleet_manager_id' => $request->fleet_manager_id,
                'document_id' => $request->document_id,
                'expired_at' => Carbon::createFromFormat('m/d/Y', $request->expired_at)->format('Y-m-d'),
                'document_image_id' => $request->document_image_id,
                'status' => $request->status,
            ]);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.fleet-document.edit', ['fleet_document' => $fleetDocument->id])
                    ->with('success', __('taxido::static.fleet_documents.create_successfully'));
            }

            return to_route('admin.fleet-document.index')->with('success', __('taxido::static.fleet_documents.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $fleetDocument = $this->model->findOrFail($id);
            $fleetDocument->destroy($id);
            return redirect()->route('admin.fleet-document.index')->with('success', __('taxido::static.fleet_documents.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $fleetDocument = $this->model->findOrFail($id);
            $fleetDocument->update(['status' => $status]);

            return json_encode(["resp" => $fleetDocument]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $fleetDocument = $this->model->onlyTrashed()->findOrFail($id);
            $fleetDocument->restore();

            return redirect()->back()->with('success', __('taxido::static.fleet_documents.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $fleetDocument = $this->model->onlyTrashed()->findOrFail($id);
            $fleetDocument->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.fleet_documents.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateStatus($request, $id)
    {
        DB::beginTransaction();
        try {

            $fleetDocument = $this->model->findOrFail($id);
            $oldStatus = $fleetDocument->status;

            $fleetDocument->update([
                'status' => $request['status']
            ]);

            if ($oldStatus !== $request['status']) {
                $fleetManager = $fleetDocument->fleetManager;
                // if ($fleetManager) {
                //     dispatch(fn() => event(new NotifyDriverDocStatusEvent($driverDocument, $request['status'])))->afterResponse();
                // }
            }

            DB::commit();
            $document = $fleetDocument->refresh();
            $isVerified = 0;
            if ($this->isDriverAllDocumentsApproved($document?->fleet_manager_id)) {
                $isVerified = 1;
            }

            $fleetManager = $document?->fleetManager;
            $fleetManager->update([
                'is_verified' => $isVerified,
            ]);

            // if ($driver) {
            //     event(new DriverVerificationEvent($driver, $isVerified ? DocumentStatusEnum::APPROVED : DocumentStatusEnum::REJECTED));
            // }

            return redirect()->route('admin.fleet-document.index')->with('success', __('taxido::static.documents.status_update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function isDriverAllDocumentsApproved($fleet_manager_id)
    {
        $totalReqDocument = Document::where('is_required', true)?->where('type', 'fleet_manager')->whereNull('deleted_at')?->count();
        $totalDriverDocuments = $this->model->where('fleet_manager_id', $fleet_manager_id)?->whereNull('deleted_at')?->count();
        if($totalDriverDocuments) {
            if($totalReqDocument) {
                $totalReqApprovedDocuments = $this->model->whereHas('document', function ($document)  {
                    $document->where('is_required', true);
                })->where('fleet_manager_id', $fleet_manager_id)?->whereNull('deleted_at')
                ?->where('status', DocumentStatusEnum::APPROVED)
                ?->count();
            }

            if(!$totalReqDocument) {
                $totalReqApprovedDocuments = $this->model->where('fleet_manager_id', $fleet_manager_id)?->whereNull('deleted_at')
                ?->where('status', DocumentStatusEnum::APPROVED)
                ?->count();
            }

            if($totalReqApprovedDocuments) {
                if($totalReqDocument > 0) {
                    return ($totalReqDocument == $totalReqApprovedDocuments);
                }

                if ($totalReqDocument == 0) {
                    return ($totalDriverDocuments == $totalReqApprovedDocuments);
                }
            }
        }

        return false;
    }
}
