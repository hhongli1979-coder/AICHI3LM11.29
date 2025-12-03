<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\PushNotification;

class PushNotificationTable
{
    protected $pushNotification;
    protected $request;

    public function __construct(Request $request)
    {
        $this->pushNotification = new PushNotification();
        $this->request = $request;
    }
    protected function formatFieldName(string $fieldName): string
    {
        return ucwords(str_replace('_', ' ', $fieldName));
    }

    public function getData()
    {
        $pushNotifications = $this->pushNotification;
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'trash':
                    return $pushNotifications->withTrashed()->whereNotNull('deleted_at')->orderBy('created_at', 'desc')->paginate($this->request->paginate);
            }
        }

        if ($this->request->has('s')) {
            return $pushNotifications->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")->orderBy('created_at', 'desc')->paginate($this->request->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $pushNotifications->orderBy($this->request->orderby, $this->request->order)->paginate($this->request->paginate);
        }

        return $pushNotifications->whereNull('deleted_at')->orderBy('created_at', 'desc')->paginate($this->request->paginate);
    }

    public function generate()
    {
        $pushNotifications = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $pushNotifications->each(function ($pushNotification) {
            $pushNotification->date = formatDateBySetting($pushNotification->created_at);

            if (is_array($pushNotification->send_to)) {
                $pushNotification->send_to = ucwords(str_replace('_', ' ', implode(', ', $pushNotification->send_to)));
            } else {
                $pushNotification->send_to = ucwords(str_replace('_', ' ', $pushNotification->send_to));
            }

            $pushNotification->scheduled = $pushNotification->is_scheduled ? 'Scheduled' : 'Delivered';
            if(!isset($pushNotification->is_scheduled)) {
                $pushNotification->scheduled = 'N/A';
            }
        });
        $tableConfig = [
            'columns' => [
                ['title' => 'Title', 'field' => 'title', 'action' => true, 'sortable' => true],
                ['title' => 'Send Push Notification', 'field' => 'send_to', 'sortable' => true],
                ['title' => 'Scheduled', 'field' => 'scheduled', 'sortable' => true, 'type' => 'badge', 'colorClasses' => getScheduleStatusColorClasses()],
                ['title' => 'Schedule At', 'field' => 'scheduled_at', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true]
            ],
            'data' => $pushNotifications,
            'actions' => [
                ['title' => 'Move to trash', 'route' => 'admin.pushNotification.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'push_notification.destroy'],
                ['title' => 'Delete Permanently', 'route' => 'admin.pushNotification.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'push_notification.forceDelete']
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->pushNotification->count()],
                ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->pushNotification->withTrashed()->whereNotNull('deleted_at')->count()]
            ],
            'bulkactions' => [
                ['title' => 'Move to Trash', 'action' => 'trashed', 'permission' => 'push_notification.destroy', 'whenFilter' => ['all', 'active', 'deactive']],
            ],
            'total' => $this->pushNotification->count()
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'trashed':
                $this->trashedHandler();
                break;
        }
    }

    public function trashedHandler(): void
    {
        $this->pushNotification->whereIn('id', $this->request->ids)->delete();
    }
}
