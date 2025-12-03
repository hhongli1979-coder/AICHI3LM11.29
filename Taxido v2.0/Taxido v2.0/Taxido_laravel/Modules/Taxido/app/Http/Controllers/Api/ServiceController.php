<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Service;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Http\Resources\Riders\ServiceResource;
use Modules\Taxido\Repositories\Api\ServiceRepository;

class ServiceController extends Controller
{
    public $repository;

    public function  __construct(ServiceRepository $repository)
    {
        $this->authorizeResource(Service::class, 'service', [
            'except' => [ 'index', 'show' ],
        ]);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $service = $this->filter($this->repository, $request);
            $service = $service->simplePaginate($request->paginate ?? $service->count() ?: null);
            return ServiceResource::collection($service ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {

        return $this->repository->show($service?->id);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        //
    }

    public function filter($service, $request)
    {
        if ($request->field && $request->sort) {
            $service = $service->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $service = $service->where('status', $request->status);
        }

        return $service;
    }
}
