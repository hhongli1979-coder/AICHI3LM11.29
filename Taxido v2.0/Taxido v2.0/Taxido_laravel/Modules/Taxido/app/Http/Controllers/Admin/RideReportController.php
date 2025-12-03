<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\RideReportRepository;

class RideReportController extends Controller
{
    public $repository;

    public function __construct(RideReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function filter(Request $request)
    {
        return $this->repository->filter($request);
    }

    public function export(Request $request)
    {
        return $this->repository->export($request);
    }
}
