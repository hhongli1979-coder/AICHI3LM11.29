<?php

namespace App\Tables;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogTable
{
  protected $blog;
  protected $request;

  public function __construct(Request $request)
  {
    $this->blog = new Blog();
    $this->request = $request;
  }

  public function getData()
  {
    $blogs = $this->blog;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $blogs = $blogs->where('status', true);
          break;
        case 'deactive':
          $blogs = $blogs->where('status', false);
          break;
        case 'trash':
          $blogs = $blogs->withTrashed()?->whereNotNull('deleted_at');
          break;

      }
    }

    if ($this->request->has('s')) {
      return $blogs->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $blogs->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    if ($this->request->export) {
      return $blogs?->latest()?->get();
    }

    return $blogs?->latest()?->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $blogs = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    // Eager loading RelationShip
    $blogs->each(function ($blog) {
      $blog->title = $blog->getTranslation('title', app()->getLocale());
      $blog->description = $blog->getTranslation('description', app()->getLocale());
      $blog->content = $blog->getTranslation('content', app()->getLocale());
      $blog->categories = $blog->categories()->pluck('name')->implode(', ');
      $blog->tags = $blog->tags()->pluck('name')->implode(', ');
      $blog->date = $blog->created_at->format('Y-m-d h:i:s A');
      $blog->date = formatDateBySetting($blog->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Title', 'field' => 'title', 'imageField' => 'blog_thumbnail_id', 'action' => true, 'sortable' => true],
        ['title' => 'Categories', 'field' => 'categories', 'sortable' => false],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.blog.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
      ],
      'data' => $blogs,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.blog.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'blog.edit'],
        ['title' => 'Move to trash', 'route' => 'admin.blog.destroy','class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'blog.destroy'],
        ['title' => 'Restore', 'route' => 'admin.blog.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'blog.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.blog.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'blog.forceDelete'],
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->blog->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->blog->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->blog->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->blog->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active','permission' => 'blog.edit', 'action' => 'active','whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive','permission' => 'blog.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'permission' => 'blog.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Restore', 'action' => 'restore', 'permission' => 'blog.restore', 'whenFilter' => ['trash']],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'blog.forceDelete', 'whenFilter' => ['trash']],
      ],
      'total' => $this->blog->count()
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
    $this->blog->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->blog->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->blog->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->blog->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->blog->whereIn('id', $this->request->ids)->forceDelete();
  }

}
