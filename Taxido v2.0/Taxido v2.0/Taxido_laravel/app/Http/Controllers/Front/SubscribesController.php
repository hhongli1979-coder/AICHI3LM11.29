<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Repositories\Front\SubscribesRepository;
use Illuminate\Http\Request;

class SubscribesController extends Controller
{
    public $repository;

    public function __construct(SubscribesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }
}
