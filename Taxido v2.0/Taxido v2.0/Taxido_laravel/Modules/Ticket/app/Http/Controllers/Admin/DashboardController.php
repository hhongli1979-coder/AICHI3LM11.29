<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Ticket\Repositories\Admin\DashboardRepository;

class DashboardController extends Controller
{
    private $repository;

    public function __construct(DashboardRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!$request->has('sort')) {
            $request->merge(['sort' => 'this_year']);
        }

        return $this->repository->index($request);
    }
}
