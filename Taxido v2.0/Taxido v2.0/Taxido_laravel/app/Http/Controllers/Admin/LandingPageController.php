<?php

namespace App\Http\Controllers\Admin;

use App\Models\LandingPage;
use Illuminate\Http\Request;
use App\Tables\SubscribesTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\LandingPageRepository;

class LandingPageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(LandingPageRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function getSubscribes(SubscribesTable $subscribesTable)
    {
        return $this->repository->getSubscribes($subscribesTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    
    public function store(Request $request) 
    {
        return $this->repository->update($request->all(), null);
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function update(Request $request, LandingPage $landingPage)
    {
        return $this->repository->update($request->all(), $landingPage->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
