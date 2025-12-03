<?php

namespace App\Tables;

use App\Models\Page;
use Illuminate\Http\Request;

class PageTable
{
  protected $page;
  protected $request;

  public function __construct(Request $request)
  {
    $this->page = new Page();
    $this->request = $request;
  }
  public function getData()
  {
    $pages = $this->page;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $pages = $pages->where('status', true);
          break;
        case 'deactive':
          $pages = $pages->where('status', false);
          break;
        case 'trash':
          $pages = $pages->withTrashed()?->whereNotNull('deleted_at');
          break;
      }
    }

    if ($this->request->has('s')) {
      return $pages->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $pages->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    if ($this->request->export) {
      return $pages?->latest()?->get();
    }

    return $pages?->latest()?->paginate($this->request?->paginate);
  }


  public function generate()
  {
    $pages = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $pages->each(function ($page) {
      $page->title = $page->getTranslation('title', app()->getLocale());
      $page->content = $page->getTranslation('content', app()->getLocale());
      $page->date = $page->created_at->format('Y-m-d h:i:s A');
      $page->date = formatDateBySetting($page->created_at);
    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Title', 'field' => 'title', 'imageField' => null, 'action' => true, 'sortable' => true],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.page.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
      ],
      'data' => $pages,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.page.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'page.edit'],
        ['title' => 'Move to trash', 'route' => 'admin.page.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'page.destroy'],
        ['title' => 'Restore', 'route' => 'admin.page.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'page.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.page.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'page.forceDelete']
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->page->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->page->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->page->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->page->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'page.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'page.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'permission' => 'page.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Restore', 'action' => 'restore', 'permission' => 'page.restore', 'whenFilter' => ['trash']],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'page.forceDelete', 'whenFilter' => ['trash']],

      ],
      'total' => $this->page->count()
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
    $this->page->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->page->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->page->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->page->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->page->whereIn('id', $this->request->ids)->forceDelete();
  }
}
