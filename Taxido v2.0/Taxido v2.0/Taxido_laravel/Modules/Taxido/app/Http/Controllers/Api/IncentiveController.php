<?php

namespace Modules\Taxido\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Modules\Taxido\Repositories\Api\IncentiveRepository;

class IncentiveController extends Controller
{
    public function __construct(private IncentiveRepository $repository)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->repository->getUnifiedIncentiveData($request);
    }

    public function processRideIncentives(Request $request): JsonResponse
    {
        return $this->repository->processRideIncentives($request);
    }
}
