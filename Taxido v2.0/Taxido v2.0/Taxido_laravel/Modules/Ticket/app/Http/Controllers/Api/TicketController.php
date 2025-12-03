<?php

namespace Modules\Ticket\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Ticket\Models\Ticket;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Api\TicketRepository;
use Modules\Ticket\Http\Requests\Api\CreateReplyRequest;
use Modules\Ticket\Http\Requests\Api\CreateTicketRequest;
use Modules\Ticket\Resources\TicketResource;

class TicketController extends Controller
{
    public $repository;

    public function  __construct(TicketRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $tickets = $this->repository?->whereNull('deleted_at');
            $tickets = $this->filter($tickets, $request);
            $tickets = $tickets->latest('created_at')->simplePaginate($request->paginate ?? $tickets->count() ?: null);
            return TicketResource::collection($tickets ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode() ?: null);
        }
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTicketRequest $request)
    {
        
        return $this->repository->store($request);
    }

    public function reply(CreateReplyRequest $request)
    {
        $ticketId = $request->ticket_id;
        return $this->repository->reply($request, $ticketId);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        return $this->repository->show($ticket);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function filter($tickets, $request)
    {
        $user_id = $request->user_id ?? getCurrentUserId();
        $tickets->where('user_id', $user_id);

        if (isset($request->status)) {
            $tickets->where('status', $request->status);
        }

        if ($request->field && $request->sort) {
            $tickets->orderBy($request->field, $request->sort);
        }

        return $tickets;
    }

}
