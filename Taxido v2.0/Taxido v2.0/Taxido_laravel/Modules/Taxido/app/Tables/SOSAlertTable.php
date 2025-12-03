<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\SOSAlert;
use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Models\SOSStatus;

class SOSAlertTable
{
    protected $sosAlert;
    protected $request;

    public function __construct(Request $request)
    {
        $this->sosAlert = new SOSAlert();
        $this->request  = $request;
    }

    public function getData()
    {
        $alerts = $this->applyFilters();
        $alerts = $this->applySearch($alerts);
        $alerts = $this->applySorting($alerts);

        return $alerts->paginate($this->request->get('paginate', 10));
    }

    protected function applyFilters()
    {
        $alerts = $this->sosAlert->latest();

        if ($this->request->has('filter')) {
            $alerts = $this->applyStatusFilter($alerts, $this->request->filter);
        }

        return $alerts;
    }

    protected function applyStatusFilter($alerts, $filter)
    {
        switch ($filter) {
            case 'trash':
                return $alerts->onlyTrashed();
            default:
                return $alerts->whereNull('deleted_at');
        }
    }

    protected function applySearch($alerts)
    {
        if ($this->request->filled('s')) {
            $searchTerm = $this->request->s;

            $alerts = $alerts->with(['created_by', 'status'])
                ->where(function ($query) use ($searchTerm) {
                    $query->whereHas('created_by', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%")
                            ->orWhere('email', 'LIKE', "%$searchTerm%");
                    })
                    ->orWhereHas('status', function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%$searchTerm%");
                    });
                });
        }

        return $alerts;
    }

    protected function applySorting($alerts)
    {
        if ($this->request->has('orderby') && $this->request->has('order')) {
            $orderby = $this->request->orderby;
            $order   = $this->request->order;

            if (Schema::hasColumn('sos_alerts', $orderby)) {
                return $alerts->orderBy($orderby, $order);
            }

            if (str_contains($orderby, 'sos_statuses.')) {
                $field = str_replace('sos_statuses.', '', $orderby);
                if (Schema::hasColumn('sos_statuses', $field)) {
                    $alerts = $alerts
                        ->join('sos_statuses', 'sos_alerts.sos_status_id', '=', 'sos_statuses.id')
                        ->addSelect('sos_alerts.*', 'sos_statuses.name as status_name');
                    return $alerts->orderBy($orderby, $order);
                }
            }
        }

        return $alerts;
    }

    public function generate()
    {
        $sosAlert = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
            $sosAlert = $this->getData();
        }

        $sosAlert->each(function ($alert) {
            $alert->created_by_name = $alert->created_by?->name ?? 'N/A';
            $alert->created_by_email = $alert->created_by?->email ?? null;
            $alert->created_by_profile = $alert->created_by?->profile_image_url ?? null;
            $alert->status = $alert->status?->name ?? 'N/A';
            $alert->date = formatDateBySetting($alert->created_at);

        });

        return [
            'columns' => [
                ['title' => 'Created By', 'field' => 'created_by_name','sortable' => true,'email' => 'created_by_email','profile_image' => 'created_by_profile','sortable' => true],
                ['title' => 'Status', 'field' => 'status', 'type' => 'badge', 'sortable' => true, 'sortField' => 'sos_statuses.name', 'colorClasses' => ['Processing' => 'warning',
                    'Completed'  => 'primary',
                    'Requested'  => 'danger',
                ]],
                ['title' => 'Date', 'field' => 'date', 'sortable' => true, 'sortField' => 'sos_alerts.created_at'],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['sos_alert.index'], 'sortable' => false],
            ],
            'actions'       => [
                ['title' => 'View', 'route' => 'admin.sos-alerts.show', 'class' => 'view', 'whenFilter' => ['all'], 'permission' => 'sos_alert.index'],
                ['title' => 'Edit', 'route' => 'admin.sos-alerts.edit', 'class' => 'edit', 'whenFilter' => ['all'], 'permission' => 'sos.edit'],
                ['title' => 'Move to Trash', 'route' => 'admin.sos-alerts.destroy', 'class' => 'delete', 'whenFilter' => ['all'], 'permission' => 'sos_alert.destroy'],
                ['title' => 'Restore', 'route' => 'admin.sos-alerts.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'sos_alert.restore'],
                ['title' => 'Delete Permanently', 'route' => 'admin.sos-alerts.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'sos_alert.forceDelete'],
            ],
            'filters'       => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getFilterCount('all')],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getFilterCount('trash')],
            ],
            'bulkactions'   => [
                ['title' => 'Mark as Completed', 'action' => 'completed', 'permission' => 'sos_alert.edit', 'whenFilter' => ['all']],
                ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'sos_alert.destroy', 'whenFilter' => ['all']],
                ['title' => 'Restore', 'action' => 'restore', 'permission' => 'sos_alert.restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'sos_alert.forceDelete', 'whenFilter' => ['trash']],
            ],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'route' => 'admin.sos-alerts.show', 'class' => 'dark-icon-box', 'permission' => 'sos_alert.index'],
            ],
            'data'          => $sosAlert,
            'total'         => $sosAlert->count(),
        ];
    }

    public function getFilterCount($filter)
    {
        $alerts = $this->sosAlert;

        if ($this->request->filled('s')) {
            $searchTerm = $this->request->s;
            $alerts = $alerts->where(function ($query) use ($searchTerm) {
                $query->whereHas('created_by', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%")
                        ->orWhere('email', 'LIKE', "%$searchTerm%");
                })
                ->orWhereHas('status', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%$searchTerm%");
                });
            });
        }

        $alerts = $this->applyStatusFilter($alerts, $filter);

        return $alerts->count();
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'completed':
                $this->markAsCompleted();
                break;
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

    protected function markAsCompleted()
    {
        $this->sosAlert->whereIn('id', $this->request->ids)->update(['sos_status_id' => SOSStatus::where('name', 'Completed')->first()->id]);
    }

    protected function trashHandler()
    {
        $this->sosAlert->whereIn('id', $this->request->ids)->delete();
    }

    protected function restoreHandler()
    {
        $this->sosAlert->whereIn('id', $this->request->ids)->restore();
    }

    protected function deleteHandler()
    {
        $this->sosAlert->whereIn('id', $this->request->ids)->forceDelete();
    }
}
