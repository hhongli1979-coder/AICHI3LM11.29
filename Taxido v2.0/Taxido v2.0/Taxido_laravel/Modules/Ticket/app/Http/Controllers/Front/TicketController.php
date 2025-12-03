<?php

namespace Modules\Ticket\Http\Controllers\Front;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Front\TicketRepository;

class TicketController extends Controller
{
    private $repository;

    public function __construct(TicketRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        //
    }

    public function create()
    {
        return $this->repository->create();
    }

    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
