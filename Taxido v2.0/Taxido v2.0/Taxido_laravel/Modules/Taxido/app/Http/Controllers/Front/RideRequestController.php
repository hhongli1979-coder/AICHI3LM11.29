<?php

namespace Modules\Taxido\Http\Controllers\Front;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Front\RideRequestRepository;

class RideRequestController extends Controller
{
  public $repository;
  /**
   * Display a listing of the resource.
   */
  public function __construct(RideRequestRepository $repository)
  {
    $this->repository = $repository;
  }

  public function store(Request $request)
  {
    return $this->repository->store($request);
  }
}
