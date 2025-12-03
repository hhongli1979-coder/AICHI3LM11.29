<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\FormField;

class FormFieldTable
{
  protected $formfield;
  protected $request;

  public function __construct(Request $request)
  {
    $this->formfield = new FormField();
    $this->request = $request;
  }

  public function getData()
  {
    $formfields = $this->formfield;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          return $formfields->where('status', true)->paginate($this->request?->paginate);
        case 'deactive':
          return $formfields->where('status', false)->paginate($this->request?->paginate);
        case 'trash':
          return $formfields->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
      }
    }

    if ($this->request->has('s')) {
      return $formfields->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      if ($this->request->orderby == 'date') {
        return $formfields->orderBy('created_at', $this->request->order)->paginate($this->request?->paginate);
      }
      return $formfields->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $formfields->whereNull('deleted_at')->paginate($this->request?->paginate);
  }


  public function generate()
  {
    $formfields = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }


    $formfields->each(function ($formfields) {
      $formfields->date = formatDateBySetting($formfields->created_at);
    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Label', 'field' => 'label', 'action' => true, 'sortable' => true],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.formfield.status', 'type' => 'status', 'sortable' => false],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true]
      ],
      'data' => $formfields,
      'actions' => [
        ['title' => 'Edit',  'route' => '', 'url' => '', 'class' => 'edit edit_modal', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.formfield.edit'],
        ['title' => 'Move to trash', 'route' => 'admin.formfield.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.formfield.destroy'],
        ['title' => 'Restore', 'route' => 'admin.formfield.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.formfield.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.formfield.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.formfield.forceDelete']
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->formfield->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->formfield->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->formfield->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->formfield->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active', 'action' => 'active', 'permission' => 'ticket.formfield.edit'],
        ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'ticket.formfield.edit'],
        ['title' => 'Move to Trash', 'action' => 'trashed', 'permission' => 'ticket.formfield.destroy'],
        ['title' => 'Restore', 'action' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.formfield.restore'],
        ['title ' => 'Delete Permanently', 'action' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.formfield.forceDelete'],
      ],
      'total' => $this->formfield->count()
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
      case 'trashed':
        $this->trashedHandler();
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
    $this->formfield->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->formfield->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->formfield->whereIn('id', $this->request->ids)->delete();
  }
  public function restoreHandler(): void
  {
    $this->formfield->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->formfield->whereIn('id', $this->request->ids)->forceDelete();
  }
}
