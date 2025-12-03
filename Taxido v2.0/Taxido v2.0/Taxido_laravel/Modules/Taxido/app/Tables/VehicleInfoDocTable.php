<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\FleetDocument;
use Modules\Taxido\Models\VehicleInfoDoc;

class VehicleInfoDocTable
{
    protected $request;
    protected $vehicleInfoDoc;

    public function __construct(Request $request)
    {
        $this->vehicleInfoDoc = VehicleInfoDoc::query();
        $this->request  = $request;
    }

    public function getData()
    {
        $vehicleInfoDocs = $this->applyFilters();
        $vehicleInfoDocs = $this->applySearch($vehicleInfoDocs);
        $vehicleInfoDocs = $this->applySorting($vehicleInfoDocs);

        if ($this->request->export) {
            return $vehicleInfoDocs?->latest()?->get();
        }

        return $vehicleInfoDocs->paginate($this->request->paginate ?? 15);
    }

    protected function applyFilters()
    {
        $vehicleInfoDocs = $this->vehicleInfoDoc->newQuery();

        // Apply trash filter
        if ($this->request->filter === 'trash') {
            $vehicleInfoDocs = $vehicleInfoDocs->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();
        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $vehicleInfoDocs = $vehicleInfoDocs->where('vehicle_info_docs.fleet_manager_id', $currentUserId);
        }

        if ($this->request->has('vehicle_info_id')) {
            $vehicleInfoDocs = $vehicleInfoDocs->where('vehicle_info_docs.vehicle_info_id', $this->request->vehicle_info_id);
        }

        return $vehicleInfoDocs;
    }

    protected function applySearch($vehicleInfoDocs)
    {
        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $vehicleInfoDocs = $vehicleInfoDocs->with(['fleetManager', 'document'])
                ->where(function ($query) use ($searchTerm) {
                    $query->whereHas('fleetManager', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%")
                            ->orWhere('email', 'LIKE', "%$searchTerm%");
                    })->orWhereHas('document', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%");
                    });
                });
        }

        return $vehicleInfoDocs;
    }

    protected function applySorting($vehicleInfoDocs)
    {
        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order   = strtolower($this->request->order) === 'asc' ? 'asc' : 'desc';

            if (Schema::hasColumn('vehicle_info_docs', $orderby)) {
                return $vehicleInfoDocs->orderBy($orderby, $order);
            }

            if (str_contains($orderby, 'users.')) {
                $field = str_replace('users.', '', $orderby);
                if (Schema::hasColumn('users', $field)) {
                    $vehicleInfoDocs = $vehicleInfoDocs
                        ->join('users', 'vehicle_info_docs.fleet_manager_id', '=', 'users.id')
                        ->addSelect('vehicle_info_docs.*', 'users.name');
                    return $vehicleInfoDocs->orderBy($orderby, $order);
                }
            }

            if (str_contains($orderby, 'documents.')) {
                $field = str_replace('documents.', '', $orderby);
                if (Schema::hasColumn('documents', $field)) {
                    $vehicleInfoDocs = $vehicleInfoDocs
                        ->join('documents', 'vehicle_info_docs.document_id', '=', 'documents.id')
                        ->addSelect('vehicle_info_docs.*', 'documents.name');
                    return $vehicleInfoDocs->orderBy($orderby, $order);
                }
            }
        }

        return $vehicleInfoDocs->orderBy('created_at', 'desc');
    }

    public function generate()
    {
        $vehicleInfoDocs = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $vehicleInfoDocs = $this->getData();
        }

        $vehicleInfoDocs->each(function ($vehicleInfoDoc) {
            $vehicleInfoDoc->manager_name    = $vehicleInfoDoc->fleetManager?->name ?? null;
            $vehicleInfoDoc->vehicle_name    = $vehicleInfoDoc->vehicle_info->name ?? null;
            $vehicleInfoDoc->vehicle_type_image_id = $vehicleInfoDoc->vehicle_info->vehicle?->vehicle_image_id ?? null;
            $vehicleInfoDoc->vehicle_type_image = $vehicleInfoDoc->vehicle_info->vehicle?->vehicle_image?->original_url ?? null;
            $vehicleInfoDoc->vehicle_plate_number = $vehicleInfoDoc->vehicle_info->plate_number ?? null;

            $vehicleInfoDoc->manager_email   = isDemoModeEnabled() ? __('static.demo_mode') : ($vehicleInfoDoc->fleetManager?->email ?? null);
            $vehicleInfoDoc->manager_profile = $vehicleInfoDoc->fleetManager->profile_image_id ?? null;
            $vehicleInfoDoc->document_name   = $vehicleInfoDoc->document->name ?? null;
            $vehicleInfoDoc->expire_at       =  $vehicleInfoDoc->expired_at?->format('Y-m-d') ?? 'N/A';
            $vehicleInfoDoc->date            = formatDateBySetting($vehicleInfoDoc->created_at);
            $vehicleInfoDoc->status          = ucfirst($vehicleInfoDoc->status);
        });

        // Base query for counts
        $baseQuery = VehicleInfoDoc::query();
        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $baseQuery = $baseQuery->where('fleet_manager_id', $currentUserId);
        }

        if ($this->request->has('fleet_manager_id')) {
            $baseQuery = $baseQuery->where('fleet_manager_id', $this->request->fleet_manager_id);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $baseQuery = $baseQuery->where(function ($query) use ($searchTerm) {
                $query->whereHas('fleetManager', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('email', 'LIKE', "%$searchTerm%");
                })->orWhereHas('document', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%");
                });
            });
        }

        return [
            'columns' => [
                ['title' => 'Document', 'field' => 'document_name', 'imageField' => 'document_image_id', 'sortable' => true, 'sortField' => 'documents.name', 'action' => true],
                ['title' => 'Vehicle', 'field' => 'vehicle_name', 'email' => 'vehicle_plate_number', 'profile_image' => 'vehicle_type_image',  'sortable' => true,  'sortField' => 'vehicle_info.name','profile_id' => 'vehicle_type_image_id',],
                ['title' => 'Fleet Manager', 'field' => 'manager_name', 'route' => 'admin.fleet-manager.show', 'email' => 'manager_email', 'profile_image' => 'manager_profile', 'sortable' => true, 'profile_id' => 'fleet_manager_id', 'sortField' => 'users.name'],
                ['title' => 'Expired At', 'field' => 'expire_at', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'type' => 'badge', 'colorClasses' => ['Pending' => 'warning', 'Approved' => 'primary', 'Rejected' => 'danger'], 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['fleet_vehicle_document.index'], 'sortable' => false],
            ],
            'data' => $vehicleInfoDocs,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.vehicleInfoDoc.edit', 'class' => 'edit', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'fleet_vehicle_document.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.vehicleInfoDoc.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'fleet_vehicle_document.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.vehicleInfoDoc.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'fleet_vehicle_document.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'fleet_vehicle_document.destroy', 'action' => 'trashed', 'whenFilter' => ['all']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'fleet_vehicle_document.forceDelete', 'whenFilter' => ['trash']],
            ],
            'viewActionBox' => ['view' => 'taxido::admin.vehicle-info-doc.show', 'field' => 'document', 'type' => 'action'],
            'total'=> $vehicleInfoDocs->total(),
        ];
    }

    public function getFilterCount($filter)
    {
        $vehicleInfoDocs = VehicleInfoDoc::query();

        if ($filter === 'trash') {
            $vehicleInfoDocs = $vehicleInfoDocs->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $vehicleInfoDocs = $vehicleInfoDocs->where('fleet_manager_id', $currentUserId);
        }

        if ($this->request->has('fleet_manager_id')) {
            $vehicleInfoDocs = $vehicleInfoDocs->where('fleet_manager_id', $this->request->fleet_manager_id);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $vehicleInfoDocs = $vehicleInfoDocs->where(function ($query) use ($searchTerm) {
                $query->whereHas('fleetManager', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('email', 'LIKE', "%$searchTerm%");
                })->orWhereHas('document', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%");
                });
            });
        }

        return $vehicleInfoDocs->count();
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'trash':
                $this->trashHandler();
                break;
            case 'restore':
                $this->restoreHandler();
                break;
            case 'delete':
                $this->deleteHandler();
                break;
        }
    }

    protected function trashHandler()
    {
        $this->vehicleInfoDoc->whereIn('id', $this->request->ids)->delete();
    }

    protected function restoreHandler()
    {
        $this->vehicleInfoDoc->withTrashed()->whereIn('id', $this->request->ids)->restore();
    }

    protected function deleteHandler()
    {
        $this->vehicleInfoDoc->withTrashed()->whereIn('id', $this->request->ids)->forceDelete();
    }
}
