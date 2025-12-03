<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Rider;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\RiderTable;
use Modules\Taxido\Http\Requests\Admin\CreateRiderRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateRiderRequest;

use Modules\Taxido\Repositories\Admin\RiderRepository;

class RiderController extends Controller
{
    private $repository;

    public function __construct(RiderRepository $repository)
    {
        $this->authorizeResource(Rider::class, 'rider');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(RiderTable $riderTable)
    {
        return $this->repository->index($riderTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.rider.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRiderRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(Rider $rider)
    {
        $rider->load(['profile_image', 'rides']);
        return view('taxido::admin.rider.details', ['rider' => $rider]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rider $rider)
    {
        return view('taxido::admin.rider.edit', ['rider' => $rider]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRiderRequest $request, Rider $rider)
    {
        return $this->repository->update($request->all(), $rider->id);
    }

    /**
     * Update Status the specified resource from storage.
     *
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rider $rider)
    {
        return $this->repository->destroy($rider->id);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
