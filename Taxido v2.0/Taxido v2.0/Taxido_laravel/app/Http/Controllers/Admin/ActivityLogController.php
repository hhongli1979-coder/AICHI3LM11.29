<?php

namespace App\Http\Controllers\Admin;

use App\Tables\ActivityTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\ActivityLogRepository;


class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(ActivityLogRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(ActivityTable $activityTable)
    {
        return $this->repository->index($activityTable->generate());
    }

    public function destroy($id)
    {
        return $this->repository->destroy($id);
    }

    public function deleteAll()
    {
        return $this->repository->deleteAll();
    }


}
