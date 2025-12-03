<?php

namespace Modules\Ticket\Tables;

use App\Models\User;
use Illuminate\Http\Request;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Models\Message;

class ReportTable
{
    protected $user;
    protected $request;

    public function __construct(Request $request)
    {
        $this->user = new User();
        $this->request = $request;
    }

    public function getUser()
    {
        return $this->user->select('users.*')->selectRaw('(SELECT COUNT(DISTINCT messages.ticket_id) FROM messages WHERE messages.reply_id = users.id) AS replied_count')->whereHas('roles', function ($query) {
            $query->where('name', '=', RoleEnum::Executive);
        });
    }

    public function getData()
    {
        $users = $this->getUser();
        if ($this->request->has('filter')) {
            switch ($this->request->filter) {
                case 'active':
                    return $users->whereNull('deleted_at')->where('status', true)->paginate($this->request?->paginate);
                case 'deactive':
                    return $users->whereNull('deleted_at')->where('status', false)->paginate($this->request?->paginate);
                case 'trash':
                    return $users->withTrashed()->whereNotNull('deleted_at')->paginate($this->request?->paginate);
            }
        }
        
        if (isset($this->request->s)) {
            return $users->withTrashed()->where(function ($query) {
                $query->where('name', 'LIKE', "%" . $this->request->s . "%")
                    ->orWhere('email', 'LIKE', "%" . $this->request->s . "%");
            })->paginate($this->request?->paginate);
        }

        if ($this->request->has('orderby') && $this->request->has('order')) {
            return $users->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
        }

        return $users->whereNull('deleted_at')->paginate($this->request?->paginate);
    }

    public function generate()
    {

        $users = $this->getData();

        if ($this->request->has('action') && $this->request->has('ids')) {
            $this->bulkActionHandler();
        }

        $tableConfig = [
            'columns' => [
                ['title' => 'Name', 'field' => 'name', 'route' => 'admin.user.edit', 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'action' => true, 'sortable' => true],
                ['title' => 'Total Answered Tickets', 'field' => 'replied_count', 'sortable' => true],
                ['title' => 'Action', 'type' => 'action', 'permission' => ['user.edit','user.destroy'], 'sortable' => false],
            ],
            'data' => $users,
            'actions' => [
                ['title' => 'Restore', 'route' => 'admin.user.restore', 'class' => 'restore', 'whenFilter' => ['trash']],
                ['title' => 'Delete Permanently', 'route' => 'admin.user.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash']],
            ],
            'filters' => [
                ['title' => 'All', 'slug' => 'all', 'count' => $this->getUser()?->whereNull('deleted_at')->count()],
            ],
            'bulkactions' => [],
            'actionButtons' => [
                ['icon' => 'ri-eye-line', 'route' => 'admin.report.show', 'class' => 'dark-icon-box', 'permission' => 'user.edit'],
            ],
            'total' => $users->count(),
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
        $this->user->whereIn('id', $this->request->ids)->update(['status' => true]);
    }

    public function deactiveHandler(): void
    {
        $this->user->whereIn('id', $this->request->ids)->update(['status' => false]);
    }

    public function trashHandler(): void
    {
        $this->user->whereIn('id', $this->request->ids)->delete();
    }

    public function restoreHandler(): void
    {
        $this->user->whereIn('id', $this->request->ids)->restore();
    }

    public function deleteHandler(): void
    {
        $this->user->whereIn('id', $this->request->ids)->forceDelete();
    }

    public function getRepliedCount($user)
    {
        return Message::where('reply_id',$user->id) ->distinct('ticket_id')->count('ticket_id');
    }
}
