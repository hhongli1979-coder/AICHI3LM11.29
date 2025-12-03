<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\EmailTemplateRepository;

class EmailTemplateController extends Controller
{
    protected $repository;

    public function __construct(EmailTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    /**s
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->repository->index($request);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request , $slug)
    {
        return $this->repository->edit($request->all(),$slug);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request , $slug)
    {
        return $this->repository->update($request->all(),$slug);
    }
}

