<?php

namespace Modules\Taxido\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\DashboardRepository;

class DashboardController extends Controller
{
    public $repository;


    public function __construct(DashboardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }
}