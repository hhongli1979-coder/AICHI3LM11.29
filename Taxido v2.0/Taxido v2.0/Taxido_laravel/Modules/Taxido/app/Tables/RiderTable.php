<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Rider;

class RiderTable
{
  
protected $rider;
protected $request;

public function __construct(Request $request)
{
  $this->rider = new Rider();
  $this->request = $request;
}

public function getRiders()
{
  $riders = $this->rider;

  $currentUserRole = getCurrentRoleName();
  $currentUserId   = getCurrentUserId();

  if ($currentUserRole == RoleEnum::RIDER) {
      return $riders->where('id', $currentUserId);
  }
  return $this->rider->where('system_reserve', false);
}

public function getData()
{
  $riders = $this->getRiders();

  if ($this->request->has('filter')) {
    switch ($this->request->filter) {
      case 'active':
        $riders = $riders->whereNull('deleted_at')->where('status', true);
        break;
      case 'deactive':
        $riders = $riders->whereNull('deleted_at')->where('status', false);
        break;
      case 'trash':
        return $riders->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);          
        break;
    }
  }

  if (isset($this->request->s)) {
    return $riders->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")
      ->orWhere('email', 'LIKE', "%" . $this->request->s . "%")?->orWhere('phone', 'LIKE', "%" . $this->request->s . "%" )->paginate($this->request?->paginate);
  }

  if ($this->request->has('orderby') && $this->request->has('order')) {
    return $riders->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
  }

  return $riders->whereNull('deleted_at')?->latest()->paginate($this->request?->paginate);
}

public function generate()
{

  $riders = $this->getData();

  if ($this->request->has('action') && $this->request->has('ids')) {
    $this->bulkActionHandler();
  }

  // Eager loading RelationShip
  $riders->each(function ($rider) {
    if (isDemoModeEnabled()) {
        $rider->email = __('static.demo_mode');
      }
    $rider->role_name =  ucfirst($rider->roles->pluck('name')->implode(', '));
  });

  $riders->each(function ($rider) {
    $rider->date = formatDateBySetting($rider->created_at);
  });

  $tableConfig = [
    'columns' => [
      ['title' => 'ID', 'field' => 'id', 'sortable' => true],
      ['title' => 'Name', 'field' => 'name', 'route' => 'admin.rider.show', 'action' => true, 'imageField' => 'profile_image_id', 'placeholderLetter' => true, 'sortable' => true, 'email' => 'email'],
      ['title' => 'Email', 'field' => 'email', 'sortable' => true],
      ['title' => 'Status', 'field' => 'status', 'route' => 'admin.rider.status', 'type' => 'status', 'sortable' => true],
      ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'users.created_at'],
      ['title' => 'Action', 'type' => 'action', 'permission' => ['rider.index'], 'sortable' => false],
    ],
    'data' => $riders,
    'actions' => [
      ['title' => 'Edit',  'route' => 'admin.rider.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'rider.edit'],
      ['title' => 'Move to trash', 'route' => 'admin.rider.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'rider.destroy'],
      ['title' => 'Restore',  'route' => 'admin.rider.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'rider.restore'],
      ['title' => 'Delete Permanently', 'route' => 'admin.rider.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'rider.forceDelete']
    ],
    'filters' => [
      ['title' => 'All', 'slug' => 'all', 'count' => $this->getRiders()?->whereNull('deleted_at')->count()],
      ['title' => 'Active', 'slug' => 'active', 'count' => $this->getRiders()?->whereNull('deleted_at')->where('status', true)->count()],
      ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->getRiders()?->whereNull('deleted_at')->where('status', false)->count()],
      ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->getRiders()?->withTrashed()?->whereNotNull('deleted_at')?->count()]
    ],
    'bulkactions' => [
      ['title' => 'Active', 'action' => 'active', 'permission' => 'rider.edit', 'whenFilter' => ['all', 'active', 'deactive']],
      ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'rider.edit', 'whenFilter' => ['all', 'active', 'deactive']],
      ['title' => 'Move to Trash', 'action' => 'trash', 'permission' => 'rider.destroy', 'whenFilter' => ['all', 'active', 'deactive']],
      ['title' => 'Restore', 'action' => 'restore', 'permission' => 'rider.restore', 'whenFilter' => ['trash']],
      ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'rider.forceDelete', 'whenFilter' => ['trash']],
    ],
    'actionButtons' => [
      ['icon' => 'ri-eye-line', 'route' => 'admin.rider.show', 'class' => 'dark-icon-box', 'permission' => 'rider.index','tooltip' => 'Rider details'],
    ],
    'total' => $riders->count()
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
  $this->rider->whereIn('id', $this->request->ids)->update(['status' => true]);
}

public function deactiveHandler(): void
{
  $this->rider->whereIn('id', $this->request->ids)->update(['status' => false]);
}

public function trashHandler(): void
{
  $this->rider->whereIn('id', $this->request->ids)->delete();
}

public function restoreHandler(): void
{
  $this->rider->whereIn('id', $this->request->ids)->restore();
}

public function deleteHandler(): void
{
  $this->rider->whereIn('id', $this->request->ids)->forceDelete();
}
}
