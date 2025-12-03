<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\SOSAlertRepository;

class SOSAlertController extends Controller
{
    public $repository;

    public function __construct(SOSAlertRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        try {

            $sosAlert = $this->filter($this->repository, $request);
            return $sosAlert->paginate($request->paginate ?? $sosAlert->count() ?: null);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store(Request $request)
    {
        return $this->repository->store($request);
    }
}
