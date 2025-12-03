<?php

namespace App\Tables;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagTable
{
  protected $tag;
  protected $request;

  public function __construct(Request $request)
  {
    $this->tag = new Tag();
    $this->request = $request;
  }

  public function getData()
  {
    $tags = $this->tag;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $tags = $tags->where('status', true);
          break;
        case 'deactive':
          $tags = $tags->where('status', false);
          break;
        case 'trash':
          $tags = $tags->withTrashed()?->whereNotNull('deleted_at');
          break;
      }
    }

    if ($this->request->has('s')) {
      return $tags->withTrashed()->where(function ($query) {
        $query->where('name', 'LIKE', "%" . $this->request->s . "%")
          ->orWhere('description', 'LIKE', "%" . $this->request->s . "%");
      })->paginate($this->request->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $tags->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $tags?->latest()?->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $tags = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $tags->each(function ($tag) {
      $tag->name = $tag->getTranslation('name', app()->getLocale());
      $tag->description = $tag->getTranslation('description', app()->getLocale());
      $tag->date = $tag->created_at->format('Y-m-d h:i:s A');
      $tag->date = formatDateBySetting($tag->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Name', 'field' => 'name', 'imageField' => null, 'sortable' => true, 'action' => true],
        ['title' => 'Description', 'field' => 'description', 'sortable' => true],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.tag.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
      ],
      'data' => $tags,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.tag.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'tag.edit'],
        ['title' => 'Move to Trash',  'route' => 'admin.tag.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'tag.destroy'],
        ['title' => 'Restore', 'route' => 'admin.tag.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'tag.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.tag.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'tag.forceDelete']
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->tag->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->tag->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->tag->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->tag->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'tag.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'tag.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'permission' => 'tag.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Restore', 'action' => 'restore', 'permission' => 'tag.restore', 'whenFilter' => ['trash']],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'tag.forceDelete', 'whenFilter' => ['trash']],
      ],
      'total' => $this->tag->count()
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
    $this->tag->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->tag->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->tag->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->tag->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->tag->whereIn('id', $this->request->ids)->forceDelete();
  }
}
