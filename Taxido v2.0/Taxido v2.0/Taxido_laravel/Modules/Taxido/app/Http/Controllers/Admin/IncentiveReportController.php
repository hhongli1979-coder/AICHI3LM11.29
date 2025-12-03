<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Admin\IncentiveReportRepository;

class IncentiveReportController extends Controller
{
    public $repository;

    /**
     * Display a listing of the resource.
     */
    public function __construct(IncentiveReportRepository $repository)
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

    public function analytics(Request $request)
    {
        return response()->json($this->repository->getAnalytics($request));
    }
}
