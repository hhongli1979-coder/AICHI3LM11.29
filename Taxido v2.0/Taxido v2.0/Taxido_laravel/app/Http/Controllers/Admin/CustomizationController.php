<?php

namespace App\Http\Controllers\Admin;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\CustomizationRepository;

class CustomizationController extends Controller
{
    protected $repository;

    public function __construct(CustomizationRepository $repository){
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
