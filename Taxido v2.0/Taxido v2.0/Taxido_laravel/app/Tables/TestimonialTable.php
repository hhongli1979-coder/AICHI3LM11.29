<?php

namespace App\Tables;

use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialTable
{
  protected $testimonial;
  protected $request;

  public function __construct(Request $request)
  {
    $this->testimonial = new Testimonial();
    $this->request = $request;
  }

  public function getData()
  {
    $testimonials = $this->testimonial;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $testimonials = $testimonials->where('status', true);
          break;
        case 'deactive':
          $testimonials = $testimonials->where('status', false);
          break;
        case 'trash':
          $testimonials = $testimonials->withTrashed()?->whereNotNull('deleted_at');
          break;
      }
    }

    if ($this->request->has('s')) {
      return $testimonials->withTrashed()->where(function ($query) {
        $query->where('title', 'LIKE', "%" . $this->request->s . "%")
          ->orWhere('rating', 'LIKE', "%" . $this->request->s . "%");
      })->paginate($this->request->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $testimonials->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $testimonials?->latest()?->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $testimonials = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $testimonials->each(function ($testimonial) {
      $testimonial->title = $testimonial->getTranslation('title', app()->getLocale());
      $testimonial->description = $testimonial->getTranslation('description', app()->getLocale());
      $testimonial->date = $testimonial->created_at->format('Y-m-d h:i:s A');
      $testimonial->date = formatDateBySetting($testimonial->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Title', 'field' => 'title', 'imageField' => 'profile_image_id', 'action' => true, 'sortable' => true],
        ['title' => 'Rating', 'field' => 'rating', 'sortable' => true],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.testimonial.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
      ],
      'data' => $testimonials,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.testimonial.edit', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'testimonial.edit'],
        ['title' => 'Move to trash', 'route' => 'admin.testimonial.destroy', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'testimonial.destroy'],
        ['title' => 'Restore', 'route' => 'admin.testimonial.restore', 'class' => 'restore', 'whenFilter' => ['trash'], 'permission' => 'testimonial.restore'],
        ['title' => 'Delete Permanently', 'route' => 'admin.testimonial.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'testimonial.forceDelete'],
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->testimonial->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->testimonial->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->testimonial->where('status', false)->count()],
        ['title' => 'Trash', 'slug' => 'trash', 'count' => $this->testimonial->withTrashed()?->whereNotNull('deleted_at')?->count()]
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'testimonial.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'testimonial.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'permission' => 'testimonial.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Restore', 'action' => 'restore', 'permission' => 'testimonial.restore', 'whenFilter' => ['trash']],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'testimonial.forceDelete', 'whenFilter' => ['trash']],

      ],
      'total' => $this->testimonial->count()
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
    $this->testimonial->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->testimonial->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $this->testimonial->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->testimonial->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->testimonial->whereIn('id', $this->request->ids)->forceDelete();
  }
}
