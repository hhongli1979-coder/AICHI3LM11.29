<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Message;

class DetailedReportTable
{
    protected $id;
    protected $request;
    protected $message;

    public function __construct(Request $request, $id)
    {
        $this->message = new Message();
        $this->request = $request;
        $this->id = $id;
    }

    public function getMessage()
    {
        return $this->message->where('reply_id', $this->id)->getRepliedTickets();
    }

    public function getData()
    {
        $messages = $this->getMessage();
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $messages->whereNull('deleted_at')->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $messages->whereNull('deleted_at')->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $messages->withTrashed()->whereNotNull('deleted_at')->paginate($this->request?->paginate);
            }
        }

        if (isset($this->request->s)) {
            return $messages->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('email', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $messages->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $messages->whereNull('deleted_at')->paginate($this->request?->paginate);
    }

    public function generate()
    {
        $messages = $this->getData();
        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $messages->each(function ($message) {
            $message->ticket_number = $message->ticket->ticket_number;
        });

        $messages->each(function ($message) {
            $message->ticket_user = $message->ticket->name ?? $message->ticket->user->name;
        });

        $messages->each(function ($message) {
            $message->rating = $message->getRating();
            $message->stars = $this->generateStarsWithRating($message->rating);
        });

        $messages->each(function ($message) {
            $message->date = formatDateBySetting($message->created_at);
        });

        $tableConfig = [
            'columns' => [
                ['title' => 'Ticket ID', 'field' => 'ticket_number', 'route' => 'admin.message.edit', 'type' => 'badge', 'action' => true, 'sortable' => true],
                ['title' => 'User', 'field' => 'ticket_user', 'sortable' => true],
                ['title' => 'Total Replies', 'field' => 'total_replies', 'sortable' => true],
                ['title' => 'Ratings', 'field' => 'stars', 'sortable' => true],
                ['title' => 'Created At', 'field' => 'date', 'sortable' => true],
            ],
            'data' => $messages,
            'actions' => [
                ['title' => 'Edit', 'route' => 'admin.message.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Move to trash', 'route' => 'admin.message.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive']],
                ['title' => 'Restore', 'route' => 'admin.message.restore', 'class' => 'restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'route' => 'admin.message.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash']],
            ],
            'filters' => [],
            'bulkactions' => [],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'route' => 'admin.message.edit', 'class' => 'dark-icon-box', 'permission' => 'message.edit'],
            ],
            'total' => $messages->count(),
        ];

        return $tableConfig;
    }

    public function bulkActionHandler()
    {
        switch ($this->request->action) {
            case 'active':
                $this->activeHandler();
                break;
            case 'deactive':
                $this->deactiveHandler();
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

    public function activeHandler(): void
    {
        $this->message->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->message->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashHandler(): void
    {
        $this->message->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->message->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->message->whereIn('id', $this->request->ids)->forceDelete();
    }

    public function generateStarsWithRating($rating)
    {
        return '⭐ (' . number_format($rating, 1) . ')';
    }
}
