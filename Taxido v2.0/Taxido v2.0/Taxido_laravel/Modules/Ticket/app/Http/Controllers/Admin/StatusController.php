<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Status;
use App\Http\Controllers\Controller;
use Modules\Ticket\Tables\StatusTable;
use Modules\Ticket\Repositories\Admin\StatusRepository;
use Modules\Ticket\Http\Requests\Admin\CreateStatusRequest;
use Modules\Ticket\Http\Requests\Admin\UpdateStatusRequest;

class StatusController extends Controller
{
    private $repository;

    public function __construct(StatusRepository $repository)
    {
        $this->authorizeResource(Status::class, 'status');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(StatusTable $statusTable)
    {
        return $this->repository->index($statusTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('ticket::admin.status.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStatusRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Status $status)
    {
        return view('ticket::admin.status.edit', ['status' => $status]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStatusRequest $request, Status $status)
    {
        return $this->repository->update($request->all(), $status->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
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
