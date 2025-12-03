<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Priority;
use App\Http\Controllers\Controller;
use Modules\Ticket\Tables\PriorityTable;
use Modules\Ticket\Repositories\Admin\PriorityRepository;
use Modules\Ticket\Http\Requests\Admin\CreatePriorityRequest;
use Modules\Ticket\Http\Requests\Admin\UpdatePriorityRequest;

class PriorityController extends Controller
{
    private $repository;

    public function __construct(PriorityRepository $repository)
    {
        $this->authorizeResource(Priority::class, 'priority');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(PriorityTable $priorityTable)
    {
        return $this->repository->index($priorityTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('ticket::admin.priority.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePriorityRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Priority $priority)
    {
        return view('ticket::admin.priority.edit', ['priority' => $priority]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePriorityRequest $request, Priority $priority)
    {
        return $this->repository->update($request->all(), $priority->id);
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
