<?php

namespace App\Http\Controllers\Admin;

use App\Models\Plugin;
use App\Tables\PluginTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\PluginRepository;
use App\Http\Requests\Admin\CreatePluginRequest;

class PluginController extends Controller
{
    private $repository;

    public function __construct(PluginRepository $repository)
    {
        $this->authorizeResource(Plugin::class, 'plugin');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(PluginTable $pluginTable)
    {
        return $this->repository->index($pluginTable->generate());
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
    public function store(CreatePluginRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Plugin $plugin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plugin $plugin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plugin $plugin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plugin $plugin)
    {
        //
    }


    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($request->status, $id);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}
