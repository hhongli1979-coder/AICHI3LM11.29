<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\HomeScreenRepository;

class HomeScreenController extends Controller
{
    public $repository;

    public function __construct(HomeScreenRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        try {

            return $this->repository->index($request);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
