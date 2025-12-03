<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Ticket\Models\Executive;
use Modules\Ticket\Tables\ExecutiveTable;
use Modules\Ticket\Repositories\Admin\ExecutiveRepository;
use Modules\Ticket\Http\Requests\Admin\CreateExecutiveRequest;
use Modules\Ticket\Http\Requests\Admin\UpdateExecutiveRequest;

class ExecutiveController extends Controller
{
    private $repository;

    public function __construct(ExecutiveRepository $repository)
    {
        $this->authorizeResource(Executive::class, 'executive');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(ExecutiveTable $executiveTable)
    {
        return $this->repository->index($executiveTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('ticket::admin.executive.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateExecutiveRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Executive $executive)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Executive $executive)
    {
        return view('ticket::admin.executive.edit', ['executive' => $executive]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExecutiveRequest $request, Executive $executive)
    {
        return $this->repository->update($request->all(), $executive->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Executive $executive)
    {
        return $this->repository->destroy($executive->id);
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
