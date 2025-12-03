<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Models\DriverDocument;

class DriverDocumentTable
{
    protected $request;
    protected $driverDocument;

    public function __construct(Request $request)
    {
        $this->driverDocument = DriverDocument::query();
        $this->request  = $request;
    }

    public function getData()
    {
        $driverDocuments = $this->applyFilters();
        $driverDocuments = $this->applySearch($driverDocuments);
        $driverDocuments = $this->applySorting($driverDocuments);

        if ($this->request->export) {
            return $driverDocuments?->latest()?->get();
        }

        return $driverDocuments->paginate($this->request->paginate ?? 15);
    }

    protected function applyFilters()
    {
        $driverDocuments = $this->driverDocument->newQuery();

        // Apply trash filter
        if ($this->request->filter === 'trash') {
            $driverDocuments = $driverDocuments->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $driverDocuments = $driverDocuments->where('driver_documents.driver_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $driverIds = Driver::where('fleet_manager_id', $currentUserId)->pluck('id')->toArray();
            $driverDocuments = $driverDocuments->whereIn('driver_documents.driver_id', $driverIds);
        }

        if ($this->request->has('driver_id')) {
            $driverDocuments = $driverDocuments->where('driver_documents.driver_id', $this->request->driver_id);
        }

        return $driverDocuments;
    }


    protected function applySearch($driverDocuments)
    {
        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $driverDocuments = $driverDocuments->with(['driver', 'document'])
                ->where(function ($query) use ($searchTerm) {
                    $query->whereHas('driver', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%")
                            ->orWhere('email', 'LIKE', "%$searchTerm%");
                    })->orWhereHas('document', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%");
                    });
                });
        }

        return $driverDocuments;
    }


    protected function applySorting($driverDocuments)
    {
        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order   = strtolower($this->request->order) === 'asc' ? 'asc' : 'desc';

            if (Schema::hasColumn('driver_documents', $orderby)) {
                return $driverDocuments->orderBy($orderby, $order);
            }

            if (str_contains($orderby, 'users.')) {
                $field = str_replace('users.', '', $orderby);
                if (Schema::hasColumn('users', $field)) {
                    $driverDocuments = $driverDocuments
                        ->join('users', 'driver_documents.driver_id', '=', 'users.id')
                        ->addSelect('driver_documents.*', 'users.name');
                    return $driverDocuments->orderBy($orderby, $order);
                }
            }

            if (str_contains($orderby, 'documents.')) {
                $field = str_replace('documents.', '', $orderby);
                if (Schema::hasColumn('documents', $field)) {
                    $driverDocuments = $driverDocuments
                        ->join('documents', 'driver_documents.document_id', '=', 'documents.id')
                        ->addSelect('driver_documents.*', 'documents.name');
                    return $driverDocuments->orderBy($orderby, $order);
                }
            }
        }

        return $driverDocuments->orderBy('created_at', 'desc');
    }

    public function generate()
    {
        $driverDocuments = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $driverDocuments = $this->getData();
        }

        $driverDocuments->each(function ($driverDocument) {
            $driverDocument->driver_name    = $driverDocument->driver->name ?? null;
            $driverDocument->driver_email   = isDemoModeEnabled() ? __('static.demo_mode') : ($driverDocument->driver->email ?? null);
            $driverDocument->driver_profile = $driverDocument->driver->profile_image_id ?? null;
            $driverDocument->document_name  = $driverDocument->document->name ?? null;
            $driverDocument->expire_at  = $driverDocument->expired_at?->format('Y-m-d') ?? 'N/A';
            $driverDocument->date = formatDateBySetting($driverDocument->created_at);
            $driverDocument->status         = ucfirst($driverDocument->status);
        });

        // Base query for counts with role-based filtering
        $baseQuery = DriverDocument::query();
        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $baseQuery = $baseQuery->where('driver_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $driverIds = Driver::where('fleet_manager_id', $currentUserId)->pluck('id')->toArray();
            $baseQuery = $baseQuery->whereIn('driver_id', $driverIds);
        }

        if ($this->request->has('driver_id')) {
            $baseQuery = $baseQuery->where('driver_id', $this->request->driver_id);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $baseQuery = $baseQuery->where(function ($query) use ($searchTerm) {
                $query->whereHas('driver', function ($q) use ($searchTerm) {
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
                ['title' => 'Driver', 'field' => 'driver_name', 'route' => 'admin.driver.show', 'email' => 'driver_email', 'profile_image' => 'driver_profile', 'sortable' => true, 'profile_id' => 'driver_id', 'sortField' => 'users.name'],
                ['title' => 'Expired At', 'field' => 'expire_at', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.user.status', 'type' => 'badge', 'colorClasses' => ['Pending' => 'warning', 'Approved' => 'primary', 'Rejected' => 'danger'], 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['driver_document.index'], 'sortable' => false],
            ],
            'data' => $driverDocuments,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.driver-document.edit', 'class' => 'edit', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'driver_document.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.driver-document.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'driver_document.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.driver-document.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'driver_document.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'driver_document.destroy', 'action' => 'trashed', 'whenFilter' => ['all']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'driver_document.forceDelete', 'whenFilter' => ['trash']],
            ],
            'viewActionBox' => ['view' => 'taxido::admin.driver-document.show', 'field' => 'document', 'type' => 'action'],
            'total'=> $driverDocuments->total(),
        ];
    }

    public function getFilterCount($filter)
    {
        $driverDocuments = DriverDocument::query();

        if ($filter === 'trash') {
            $driverDocuments = $driverDocuments->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $driverDocuments = $driverDocuments->where('driver_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $driverIds = Driver::where('fleet_manager_id', $currentUserId)->pluck('id')->toArray();
            $driverDocuments = $driverDocuments->whereIn('driver_id', $driverIds);
        }

        if ($this->request->has('driver_id')) {
            $driverDocuments = $driverDocuments->where('driver_id', $this->request->driver_id);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $driverDocuments = $driverDocuments->where(function ($query) use ($searchTerm) {
                $query->whereHas('driver', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('email', 'LIKE', "%$searchTerm%");
                })->orWhereHas('document', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%");
                });
            });
        }

        return $driverDocuments->count();
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
        $this->driverDocument->whereIn('id', $this->request->ids)->delete();
    }

    protected function restoreHandler()
    {
        $this->driverDocument->withTrashed()->whereIn('id', $this->request->ids)->restore();
    }

    protected function deleteHandler()
    {
        $this->driverDocument->withTrashed()->whereIn('id', $this->request->ids)->forceDelete();
    }
}
