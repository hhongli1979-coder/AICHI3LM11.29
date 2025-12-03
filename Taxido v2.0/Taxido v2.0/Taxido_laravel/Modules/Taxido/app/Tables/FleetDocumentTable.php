<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\FleetDocument;

class FleetDocumentTable
{
    protected $request;
    protected $fleetDocument;

    public function __construct(Request $request)
    {
        $this->fleetDocument = FleetDocument::query();
        $this->request  = $request;
    }

    public function getData()
    {
        $fleetDocuments = $this->applyFilters();
        $fleetDocuments = $this->applySearch($fleetDocuments);
        $fleetDocuments = $this->applySorting($fleetDocuments);

        if ($this->request->export) {
            return $fleetDocuments?->latest()?->get();
        }

        return $fleetDocuments->paginate($this->request->paginate ?? 15);
    }

    protected function applyFilters()
    {
        $fleetDocuments = $this->fleetDocument->newQuery();

        // Apply trash filter
        if ($this->request->filter === 'trash') {
            $fleetDocuments = $fleetDocuments->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        // If Fleet Manager -> show only their fleet documents
        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $fleetDocuments = $fleetDocuments->where('fleet_documents.fleet_manager_id', $currentUserId);
        }

        if ($this->request->has('fleet_manager_id')) {
            $fleetDocuments = $fleetDocuments->where('fleet_documents.fleet_manager_id', $this->request->fleet_manager_id);
        }

        return $fleetDocuments;
    }

    protected function applySearch($fleetDocuments)
    {
        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $fleetDocuments = $fleetDocuments->with(['fleetManager', 'document'])
                ->where(function ($query) use ($searchTerm) {
                    $query->whereHas('fleetManager', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%")
                            ->orWhere('email', 'LIKE', "%$searchTerm%");
                    })->orWhereHas('document', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%");
                    });
                });
        }

        return $fleetDocuments;
    }

    protected function applySorting($fleetDocuments)
    {
        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order   = strtolower($this->request->order) === 'asc' ? 'asc' : 'desc';

            if (Schema::hasColumn('fleet_documents', $orderby)) {
                return $fleetDocuments->orderBy($orderby, $order);
            }

            if (str_contains($orderby, 'users.')) {
                $field = str_replace('users.', '', $orderby);
                if (Schema::hasColumn('users', $field)) {
                    $fleetDocuments = $fleetDocuments
                        ->join('users', 'fleet_documents.fleet_manager_id', '=', 'users.id')
                        ->addSelect('fleet_documents.*', 'users.name');
                    return $fleetDocuments->orderBy($orderby, $order);
                }
            }

            if (str_contains($orderby, 'documents.')) {
                $field = str_replace('documents.', '', $orderby);
                if (Schema::hasColumn('documents', $field)) {
                    $fleetDocuments = $fleetDocuments
                        ->join('documents', 'fleet_documents.document_id', '=', 'documents.id')
                        ->addSelect('fleet_documents.*', 'documents.name');
                    return $fleetDocuments->orderBy($orderby, $order);
                }
            }
        }

        return $fleetDocuments->orderBy('created_at', 'desc');
    }

    public function generate()
    {
        $fleetDocuments = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $fleetDocuments = $this->getData();
        }

        $fleetDocuments->each(function ($fleetDocument) {
            $fleetDocument->manager_name    = $fleetDocument->fleetManager->name ?? null;
            $fleetDocument->manager_email   = isDemoModeEnabled() ? __('static.demo_mode') : ($fleetDocument->fleetManager->email ?? null);
            $fleetDocument->manager_profile = $fleetDocument->fleetManager->profile_image_id ?? null;
            $fleetDocument->document_name   = $fleetDocument->document->name ?? null;
            $fleetDocument->expire_at       = $fleetDocument->expired_at == 'null' ? $fleetDocument->expired_at?->format('Y-m-d') : 'N/A';
            $fleetDocument->date            = formatDateBySetting($fleetDocument->created_at);
            $fleetDocument->status          = ucfirst($fleetDocument->status);
        });

        // Base query for counts
        $baseQuery = FleetDocument::query();
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
                ['title' => 'Fleet Manager', 'field' => 'manager_name', 'route' => 'admin.fleet-manager.show', 'email' => 'manager_email', 'profile_image' => 'manager_profile', 'sortable' => true, 'profile_id' => 'fleet_manager_id', 'sortField' => 'users.name'],
                ['title' => 'Expired At', 'field' => 'expire_at', 'sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'route' => 'admin.user.status', 'type' => 'badge', 'colorClasses' => ['Pending' => 'warning', 'Approved' => 'primary', 'Rejected' => 'danger'], 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['fleet_document.index'], 'sortable' => false],
            ],
            'data' => $fleetDocuments,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.fleet-document.edit', 'class' => 'edit', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'fleet_document.edit'],
                ['title' => 'Move to trash', 'route' => 'admin.fleet-document.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'approved', 'rejected'], 'permission' => 'fleet_document.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.fleet-document.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'fleet_document.forceDelete'],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')],
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'permission' => 'fleet_document.destroy', 'action' => 'trashed', 'whenFilter' => ['all']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'fleet_document.forceDelete', 'whenFilter' => ['trash']],
            ],
            'viewActionBox' => ['view' => 'taxido::admin.fleet-document.show', 'field' => 'document', 'type' => 'action'],
            'total'=> $fleetDocuments->total(),
        ];
    }

    public function getFilterCount($filter)
    {
        $fleetDocuments = FleetDocument::query();

        if ($filter === 'trash') {
            $fleetDocuments = $fleetDocuments->onlyTrashed();
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId   = getCurrentUserId();

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $fleetDocuments = $fleetDocuments->where('fleet_manager_id', $currentUserId);
        }

        if ($this->request->has('fleet_manager_id')) {
            $fleetDocuments = $fleetDocuments->where('fleet_manager_id', $this->request->fleet_manager_id);
        }

        if ($this->request->has('s')) {
            $searchTerm = $this->request->s;
            $fleetDocuments = $fleetDocuments->where(function ($query) use ($searchTerm) {
                $query->whereHas('fleetManager', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('email', 'LIKE', "%$searchTerm%");
                })->orWhereHas('document', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%");
                });
            });
        }

        return $fleetDocuments->count();
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
        $this->fleetDocument->whereIn('id', $this->request->ids)->delete();
    }

    protected function restoreHandler()
    {
        $this->fleetDocument->withTrashed()->whereIn('id', $this->request->ids)->restore();
    }

    protected function deleteHandler()
    {
        $this->fleetDocument->withTrashed()->whereIn('id', $this->request->ids)->forceDelete();
    }
}
