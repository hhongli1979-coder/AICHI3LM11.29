<?php

namespace Modules\Taxido\Http\Controllers\Front;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Location;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Front\LocationRepository;

class LocationController extends Controller
{
    public $repository;

    public function __construct(LocationRepository $locationRepository)
    {
        $this->repository = $locationRepository;
    }

    public function index(Request $request)
    {   
        return $this->repository->index();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::front.location.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }
    
    public function edit(Location $location)
    {
        return view('taxido::front.location.create', ['location' => $location]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        return $this->repository->update($request->all(), $location->id);
    }
    
    public function destroy(string $id)
    {
        return $this->repository->destroy($id);
    }
}
