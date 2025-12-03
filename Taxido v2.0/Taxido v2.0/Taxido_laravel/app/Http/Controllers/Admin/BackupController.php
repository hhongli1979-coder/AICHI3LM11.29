<?php

namespace App\Http\Controllers\Admin;


use App\Models\Backup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\BackupRepository;

class BackupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(BackupRepository $repository)
    {
        $this->authorizeResource(Backup::class, 'backup');
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    public function downloadDbBackup($id)
    {
        return $this->repository->downloadDbBackup($id);
    }

    public function downloadFilesBackup($id)
    {
        return $this->repository->downloadFilesBackup($id);
    }

    public function downoadUploadsBackup($id)
    {
        return $this->repository->downoadUploadsBackup($id);
    }

    public function restoreBackup($id)
    {
        return $this->repository->restoreBackup($id);
    }
    public function deleteBackup($id)
    {
        return $this->repository->deleteBackup($id);
    }

}
