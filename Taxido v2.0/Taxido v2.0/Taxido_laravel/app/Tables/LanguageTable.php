<?php

namespace App\Tables;

use App\Models\Language;
use Illuminate\Http\Request;

class LanguageTable
{
  protected $language;
  protected $request;

  public function __construct(Request $request)
  {
    $this->language = new Language();
    $this->request = $request;
  }

  public function getData()
  {
    $languages = $this->language;
    if ($this->request->has('filter')) {
      switch ($this->request->filter) {
        case 'active':
          return $languages->where('status', true)->paginate($this->request?->paginate);
        case 'deactive':
          return $languages->where('status', false)->paginate($this->request?->paginate);
        case 'trash':
          return $languages->withTrashed()?->whereNotNull('deleted_at')?->paginate($this->request?->paginate);
      }
    }

    if ($this->request->has('s')) {
      return $languages->withTrashed()->where('name', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $languages->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $languages->whereNull('deleted_at')->paginate($this->request?->paginate);
  }

  public function generate()
  {
    $languages = $this->getData();
    if ($this->request->has('action') && $this->request->has('ids')) {
      $this->bulkActionHandler();
    }

    $languages->each(function ($language) {
      $language->date = $language->created_at->format('Y-m-d h:i:s A');
      $language->date = formatDateBySetting($language->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Name', 'field' => 'name', 'imageField' => 'null',  'action' => true, 'sortable' => true],
        ['title' => 'Locale', 'field' => 'locale', 'imageField' => null, 'action' => false, 'sortable' => true],
        ['title' => 'App Locale', 'field' => 'app_locale', 'imageField' => null, 'action' => false, 'sortable' => true],
        ['title' => 'RTL', 'field' => 'is_rtl', 'route' => 'admin.language.rtl', 'type' => 'status', 'sortable' => false],
        ['title' => 'Status', 'field' => 'status', 'route' => 'admin.language.status', 'type' => 'status', 'sortable' => true],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => true, 'sortField' => 'created_at'],
        ['title' => 'Action', 'type' => 'action', 'permission' => 'language.edit',  'sortable' => false],
      ],
      'data' => $languages,
      'actions' => [
        ['title' => 'Restore', 'route' => 'admin.language.restore', 'class' => 'restore', 'whenFilter' => ['trash'],'permission' => 'languagetax
.edit'],
        ['title' => 'Delete Permanently', 'route' => 'admin.language.forceDelete', 'class' => 'delete', 'whenFilter' => ['trash'], 'permission' => 'language.destroy']
      ],
      'filters' => [
        ['title' => 'All', 'slug' => 'all', 'count' => $this->language->count()],
        ['title' => 'Active', 'slug' => 'active', 'count' => $this->language->where('status', true)->count()],
        ['title' => 'Deactive', 'slug' => 'deactive', 'count' => $this->language->where('status', false)->count()],
      ],
      'bulkactions' => [
        ['title' => 'Active', 'permission' => 'language.edit', 'action' => 'active', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Deactive', 'permission' => 'language.edit', 'action' => 'deactive', 'whenFilter' => ['all', 'active', 'deactive']],
        ['title' => 'Move to Trash', 'permission' => 'language.destroy', 'action' => 'trashed', 'whenFilter' => ['all', 'active', 'deactive']],
      ],
      'actionButtons' => [
        ['icon' => 'ri-edit-line', 'route' => 'admin.language.edit', 'class' => 'dark-icon-box', 'permission' => 'language.edit'],
        ['icon' => 'ri-earth-line', 'route' => 'admin.language.translate', 'class' => 'dark-icon-box', 'permission' => 'language.edit'],
      ],
      'modalActionButtons' => [
        ['icon' => 'ri-delete-bin-5-line', 'route' => 'admin.language.destroy', 'permission' => 'language.destroy', 'class' => 'danger-icon-box', 'modalId' => 'deleteModal', 'modalTitle' => 'Delete Item ?', 'modalDesc' => "This Item Will Be Deleted Permanently. You Can't Undo This Action. ", "modalMethod" => "DELETE", "modalBtnText" => 'Delete'],
      ],
      'total' => $this->language->count()
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
    }
  }

  public function activeHandler(): void
  {
    $this->language->whereIn('id', $this->request->ids)->update(['status' => true]);
  }

  public function deactiveHandler(): void
  {
    $this->language->whereIn('id', $this->request->ids)->update(['status' => false]);
  }

  public function trashedHandler(): void
  {
    $languages = $this->language->whereIn('id', $this->request->ids);
    $languages->each(function ($language) {
      Language::deleteLangFolder($language);
      Language::deleteModuleLangFolder($language);
    });
    $languages->delete();
  }
}
