<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\Dispatcher;
use Modules\Taxido\Tables\DispatcherTable;
use Modules\Taxido\Repositories\Admin\DispatcherRepository;
use Modules\Taxido\Http\Requests\Admin\CreateDispatcherRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateDispatcherRequest;

class DispatcherController extends Controller
{
    private $repository;

    public function __construct(DispatcherRepository $repository)
    {
        $this->authorizeResource(Dispatcher::class, 'dispatcher');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(DispatcherTable $dispatcherTable)
    {
        return $this->repository->index($dispatcherTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.dispatcher.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDispatcherRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the specified resource.
     */
    public function show(Dispatcher $dispatcher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dispatcher $dispatcher)
    {
        return view('taxido::admin.dispatcher.edit', ['dispatcher' => $dispatcher]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDispatcherRequest $request, Dispatcher $dispatcher)
    {
        return $this->repository->update($request->all(), $dispatcher->id);
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
    public function destroy(Dispatcher $dispatcher)
    {
        return $this->repository->destroy($dispatcher->id);
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
