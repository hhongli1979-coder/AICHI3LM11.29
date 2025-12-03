<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Modules\Taxido\Models\Ambulance;
use Modules\Taxido\Tables\AmbulanceTable;
use Modules\Taxido\Repositories\Admin\AmbulanceRepository;

class AmbulanceController extends Controller
{

    public $repository;

    public function __construct(AmbulanceRepository $repository)
    {
        $this->authorizeResource(Ambulance::class, 'ambulance');
        $this->repository = $repository;
    }

     /**
     * Display a listing of the resource.
     */
    public function index(AmbulanceTable $ambulanceTable)
    {
        return $this->repository->index($ambulanceTable->generate());
    }
}