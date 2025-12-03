<?php

namespace App\Repositories\Admin;

use Exception;
use ZipArchive;
use App\Models\Backup;
use Spatie\Backup\Config\Config;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Artisan;
use Prettus\Repository\Eloquent\BaseRepository;
use Spatie\Backup\BackupDestination\BackupDestinationFactory;

class BackupRepository extends BaseRepository
{
    protected $config;

    function model()
    {
        $this->config = app(Config::class);
        return Backup::class;
    }

    public function index()
    {

        $backups = $this->model->whereNull('deleted_at')->get();

        return view('admin.system-tool.backup',['backups' => $backups]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $backupType = $request->input('backup_type');
            $filePaths = [];

            if ($backupType === 'db' || $backupType === 'both') {

                Artisan::call('backup:run --only-db');

                $dbFilePath = $this->getFilePath();

                $filePaths['db'] = $dbFilePath;
            }

            if ($backupType === 'files' || $backupType === 'both') {
                Artisan::call('backup:run --only-files');
                $filesFilePath = $this->getFilePath();
                $filePaths['files'] = $filesFilePath;
            }

            if ($backupType === 'media' || $backupType === 'both' || $backupType === 'db' ) {

                $folderPath = storage_path('app/public');
                $uniqueFileName = 'media_' . now()->format('Ymd_His') . '.zip';
                $zipFilePath = storage_path('app/backup/' . $uniqueFileName);

                if (!is_dir($folderPath)) {
                    return to_route('admin.backup.index')->with('danger', __('static.pages.could_not_open_folder'));
                }

                $zip = new ZipArchive;

                if ($zip->open($zipFilePath, ZipArchive::CREATE) === true) {
                    $files = new \RecursiveIteratorIterator(
                        new \RecursiveDirectoryIterator($folderPath),
                        \RecursiveIteratorIterator::LEAVES_ONLY
                    );

                    foreach ($files as $file) {
                        if (!$file->isDir()) {
                            $filePath = $file->getRealPath();
                            $relativePath = substr($filePath, strlen($folderPath) + 1);
                            $zip->addFile($filePath, $relativePath);
                        }
                    }

                    $filePaths['media'] = $uniqueFileName;
                    $zip->close();
                } else {
                    return to_route('admin.backup.index')->with('danger', __('static.pages.could_not_create_zip'));
                }
            }

            $backup = $this->model->create([
                'title' => $request->title ?? 'backup_' . now()->format('Y-m-d'),
                'description' => $request->description,
                'file_path' => $filePaths,
            ]);

            $backup->file_path = $filePaths;
            $backup->save();

            DB::commit();
            return to_route('admin.backup.index')->with('success', __('static.system_tools.backup_create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getFilePath()
    {
        $backupDestination = BackupDestinationFactory::createFromArray($this->config)
        ->first();

        $latestBackupPath = $backupDestination->newestBackup()?->path();

        return $latestBackupPath;
    }

    public function downloadDbBackup($id)
    {
        $backup = $this->model->where('id',$id)->first();
        $filePath = Storage_path('app/backup/'.$backup->file_path['db']);
        if (file_exists($filePath)) {
            return response()->download($filePath);
        }
        return to_route('admin.backup.index')->with('danger', __('static.system_tools.file_not_found'));
    }

    public function downloadFilesBackup($id)
    {
        $backup = $this->model->where('id',$id)->first();
        $filePath = Storage_path('app/backup/'.$backup->file_path['files']);
        if (file_exists($filePath)) {
            return response()->download($filePath);
        }

        return to_route('admin.backup.index')->with('danger', __('static.system_tools.file_not_found'));
    }

    public function downoadUploadsBackup($id)
    {
        $backup = $this->model->where('id',$id)->first();
        $filePath = Storage_path('app/backup/'.$backup->file_path['media']);
        if (file_exists($filePath)) {
            return response()->download($filePath);
        }

        return to_route('admin.backup.index')->with('danger', __('static.system_tools.file_not_found'));
    }

    public function restoreBackup($id)
    {
        $backup = $this->model->where('id', $id)->first();
        $zipFilePath = storage_path('app/backup/' . $backup->file_path['db']);
        if (!file_exists($zipFilePath)) {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.file_not_found'));
        }

        $extractPath = storage_path('app/backup/temp');
        if (!is_dir($extractPath)) {
            mkdir($extractPath, 0777, true);
        }

        $zip = new ZipArchive;
        if ($zip->open($zipFilePath) === true) {
            $zip->extractTo($extractPath);
            $zip->close();
        } else {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.could_not_extract_backup_zip'));
        }

        $sqlFiles = glob($extractPath . '/db-dumps/*.sql');
        if (empty($sqlFiles)) {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.no_sql_file_found'));
        }

        $sqlFile = $sqlFiles[0];
        DB::unprepared(file_get_contents($sqlFile));

        array_map('unlink', glob($extractPath . '/db-dumps/*'));
        rmdir($extractPath . '/db-dumps');
        rmdir($extractPath);

        if (empty($backup->file_path['media'] ?? null)) {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.media_file_not_found'));
        }

        $mediaZipFilePath = storage_path('app/backup/' . $backup->file_path['media']);
        if (!file_exists($mediaZipFilePath)) {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.media_file_not_found'));
        }

        rename(storage_path('app/public'), storage_path('app/public_' . now()->format('Ymd_His')));

        $publicPath = storage_path('app/public');
        if ($zip->open($mediaZipFilePath) === true) {
            $zip->extractTo($publicPath);
            $zip->close();
        } else {
            return to_route('admin.backup.index')->with('danger', __('static.system_tools.could_not_extract_media_zip'));
        }

        return to_route('admin.backup.index')->with('success', __('static.system_tools.backup_restored_successfully'));
    }

    public function deleteBackup($id)
    {
        DB::beginTransaction();
        try {
            $backup = $this->model->findOrFail($id);

            $filePaths = [
                'db' => $backup->file_path['db'] ?? null,
                'files' => $backup->file_path['files'] ?? null,
                'media' => $backup->file_path['media'] ?? null,
            ];

            foreach ($filePaths as $key => $filePath) {
                if ($filePath) {
                    $fullPath = storage_path('app/backup/' . $filePath);
                    if (file_exists($fullPath)) {
                        unlink($fullPath);
                    }
                }
            }
            $backup->delete();

            DB::commit();
            return to_route('admin.backup.index')->with('success', __('static.system_tools.backup_deleted_successfully'));

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }



}
