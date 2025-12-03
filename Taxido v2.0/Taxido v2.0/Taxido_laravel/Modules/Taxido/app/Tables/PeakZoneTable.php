<?php

namespace Modules\Taxido\Tables;

use Illuminate\Http\Request;
use Modules\Taxido\Models\PeakZone;
use Illuminate\Support\Facades\Schema;

class PeakZoneTable
{
  protected $peakZone;
  protected $request;

  public function __construct(Request $request)
  {
    $this->peakZone = new PeakZone();
    $this->request = $request;
  }
  public function getData()
  {
    $peakZones = $this->peakZone;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          $peakZones = $peakZones->where('is_active', true);
          break;
        case 'deactive':
          $peakZones = $peakZones->where('is_active', false);
          break;
      }
    }

    if ($this->request->has('s')) {
          $searchTerm = $this->request->s;
          $peakZones = $peakZones->withTrashed()->where(function ($query) use ($searchTerm) {
              $query->where('name', 'LIKE', "%{$searchTerm}%");
          });
      }

      if ($this->request->has('orderby') && $this->request->has('order')) {
          $peakZones = $peakZones->orderBy($this->request->orderby, $this->request->order);
      } else {
          $peakZones = $peakZones->latest();
      }

      return $peakZones->paginate($this->request->paginate);
  }

  public function generate()
  {
    $peakZones = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $peakZones->each(function ($peakZone) {
      $peakZone->date = formatDateBySetting($peakZone->created_at);
      $peakZone->date = $peakZone->created_at?->format('Y-m-d h:i:s A');
      $peakZone->distance_type = ucfirst($peakZone?->distance_type);
    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Name', 'field' => 'name', 'imageField' => null, 'action' => true, 'sortable' => true],
        ['title' => 'Status', 'field' => 'is_active', 'route' => 'admin.peakZone.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at']
      ],
      'data' => $peakZones,
      'actions' => [
        ['title' => 'Edit',  'route' => 'admin.peakZone.edit', 'url' => '', 'class' => 'edit', 'whenFilter' => ['all', 'active', 'deactive'], 'isTranslate' => true, 'permission' => 'zone.edit'],
        ['title' => 'Delete Permanently', 'route' => 'admin.peakZone.forceDelete', 'class' => 'delete', 'whenFilter' => ['all', 'active', 'deactive'], 'permission' => 'zone.forceDelete'],
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->peakZone->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->peakZone->where('is_active', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->peakZone->where('is_active', false)->count()],
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'zone.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'zone.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Delete Permanently', 'action' => 'delete', 'permission' => 'zone.forceDelete', 'whenFilter' => ['trash']],
      ],
      'total' => $this->peakZone->count()
    ];

    return $tableConfig;
  }

  public function applySorting($peakZones)
  {
    $orderby = $this->request->orderby;
    $order = $this->request->order;
    if (Schema::hasColumn('zones', $orderby)) {
      return $peakZones->orderBy($orderby, $order);
    }

    return $peakZones;
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
    $this->peakZone->whereIn('id', $this->request->ids)->update(['is_active' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->peakZone->whereIn('id', $this->request->ids)->update(['is_active' => false]);
  }

  public function trashedHandler(): void
  {
    $this->peakZone->whereIn('id', $this->request->ids)->delete();
  }

  public function restoreHandler(): void
  {
    $this->peakZone->whereIn('id', $this->request->ids)->restore();
  }

  public function deleteHandler(): void
  {
    $this->peakZone->whereIn('id', $this->request->ids)->forceDelete();
  }
}
