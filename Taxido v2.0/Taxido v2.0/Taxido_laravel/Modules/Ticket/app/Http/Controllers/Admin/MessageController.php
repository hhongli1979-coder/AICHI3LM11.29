<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Admin\MessageRepository;
use Modules\Ticket\Http\Requests\Admin\CreateMessageRequest;

class MessageController extends Controller
{
    private $repository;

    public function __construct(MessageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(CreateMessageRequest $request)
    {
        return $this->repository->store($request);
         
    }
}
