<?php

namespace Modules\Ticket\Tables;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Knowledge;

class KnowledgeTable
{
  protected $knowledge;
  protected $request;

  public function __construct(Request $request)
  {
    $this->knowledge = new Knowledge();
    $this->request = $request;
  }

  public function getData()
  {
    $knowledges = $this->knowledge;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          return $knowledges->where('status', true)->paginate($this->request?->paginate);
        case 'deactive':
          return $knowledges->where('status', false)->paginate($this->request?->paginate);
        case 'trash':
          return $knowledges->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
      }
    }

    if ($this->request->has('s')) {
      return $knowledges->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $knowledges->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $knowledges->whereNull('deleted_at')->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $knowledges = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    // Eager loading RelationShip
    $knowledges->each(function ($knowledge) {
      $knowledge->title = $knowledge->getTranslation('title', app()->getLocale());
      $knowledge->description = $knowledge->getTranslation('description', app()->getLocale());
      $knowledge->content = $knowledge->getTranslation('content', app()->getLocale());
      $knowledge->categories = $knowledge->categories()->pluck('name')->implode(', ');
      $knowledge->date = formatDateBySetting($knowledge->created_at);
    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Title', 'field' => 'title', 'imageField' => 'knowledge_thumbnail_id', 'action' => true, 'sortable' => true],
        ['title' => 'Categories', 'field' => 'categories', 'sortable' => false],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.knowledge.status', 'type' => 'status', 'sortable' => false],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => false]
      ],
      'data' => $knowledges,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.knowledge.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'ticket.knowledge.edit'],
        ['title' => 'Move to trash', 'route' => 'admin.knowledge.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'ticket.knowledge.destroy'],
        ['title' => 'Restore', 'route' => 'admin.knowledge.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.knowledge.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.knowledge.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.knowledge.forceDelete']
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->knowledge->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->knowledge->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->knowledge->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->knowledge->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active', 'action' => 'active', 'permission' => 'ticket.knowledge.edit', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'action' => 'deactive', 'permission' => 'ticket.knowledge.edit', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'action' => 'trashed', 'permission' => 'ticket.knowledge.destroy', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Restore', 'action' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'ticket.knowledge.restore'],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'ticket.knowledge.forceDelete'],
      ],
      'total' => $this->knowledge->count()
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
    $this->knowledge->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->knowledge->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->knowledge->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->knowledge->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->knowledge->whereIn('id', $this->request->ids)->forceDelete();
  }
}
