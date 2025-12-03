<?php

namespace App\Tables;

use App\Models\Backup;
use Illuminate\Http\Request;

class BackupTable
{
  protected $backup;
  protected $request;

  public function __construct(Request $request)
  {
    $this->backup = new Backup();
    $this->request = $request;
  }
  public function getData()
  {
    $backups = $this->backup;

    if ($this->request->has('s')) {
      return $backups->withTrashed()->where('title', 'LIKE', "%" . $this->request->s . "%")?->paginate($this->request?->paginate);
    }

    if ($this->request->has('orderby') && $this->request->has('order')) {
      return $backups->orderBy($this->request->orderby, $this->request->order)->paginate($this->request?->paginate);
    }

    return $backups->whereNull('deleted_at')->paginate($this->request?->paginate);
  }


  public function generate()
  {
    $backups = $this->getData();
 
    $backups->each(function ($backup) {
      $backup->date = formatDateBySetting($backup->created_at);

    });

    $tableConfig = [
      'columns' => [
        ['title' => 'Title', 'field' => 'title', 'imageField' => null, 'action' => true, 'sortable' => true],
        ['title' => 'description', 'field' => 'description', 'imageField' => null, 'sortable' => true],

        // ['title' => 'Status', 'field' => 'status', 'route' => 'admin.backup.status', 'type' => 'status', 'sortable' => false],
        ['title' => 'Created At', 'field' => 'date', 'sortable' => false],
        ['title' => 'Action', 'type' => 'action', 'permission' => ['system-tool.index'], 'sortable' => false],
      ],
      'data' => $backups,
      'actions' => [],
      'filters' => [],
      'bulkactions' => [],
      'actionButtons' => [
        ['icon' => 'ri-download-2-line', 'route' => 'admin.backup.downloadDbBackup', 'class' => 'dark-icon-box', 'permission' => 'system-tool.index'],
        ['icon' => 'ri-file-download-line', 'route' => 'admin.backup.downloadFilesBackup', 'class' => 'dark-icon-box', 'permission' => 'system-tool.index'],
        ['icon' => 'ri-folder-download-line', 'route' => 'admin.backup.downoadUploadsBackup', 'class' => 'dark-icon-box', 'permission' => 'system-tool.index'],
        ['title' => 'Restore', 'route' => 'admin.backup.restoreBackup', 'class' => 'dark-icon-box', 'permission' => 'system-tool.index'],
      ],
      'total' => $this->backup->count()
    ];

    return $tableConfig;
  }

}
