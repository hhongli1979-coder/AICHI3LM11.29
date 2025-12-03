<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Ticket;
use App\Http\Controllers\Controller;
use Modules\Ticket\Tables\TicketTable;
use Modules\Ticket\Repositories\Admin\TicketRepository;
use Modules\Ticket\Http\Requests\Admin\CreateTicketRequest;

class TicketController extends Controller
{
    private $repository;

    public function __construct(TicketRepository $repository)
    {
        $this->authorizeResource(Ticket::class, 'ticket');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(TicketTable $ticketTable)
    {
        return $this->repository->index($ticketTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->repository->create();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTicketRequest $request)
    {
        return $this->repository->store($request);
    }

    public function reply(Ticket $ticket)
    {
        return $this->repository->reply($ticket);
    }

    public function assign(Request $request)
    {
        return $this->repository->assign($request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        return $this->repository->destroy($ticket->id);
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

    public function download($mediaId)
    {
        return $this->repository->download($mediaId);
    }
}
