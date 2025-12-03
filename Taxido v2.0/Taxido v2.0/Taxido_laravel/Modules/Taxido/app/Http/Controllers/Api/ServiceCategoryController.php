<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\ServiceCategory;
use Modules\Taxido\Repositories\Api\ServiceCategoryRepository;
use Modules\Taxido\Http\Resources\Riders\ServiceCategoryResource;

class ServiceCategoryController extends Controller
{
    public $repository;

    public function  __construct(ServiceCategoryRepository $repository)
    {
        $this->authorizeResource(ServiceCategory::class, 'serviceCategory', [
            'except' => [ 'index', 'show' ],
        ]);
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $serviceCategory = $this->filter($this->repository, $request);
            
            $serviceCategory = $serviceCategory->simplePaginate($request->paginate ?? $serviceCategory->count() ?: null);
            return ServiceCategoryResource::collection($serviceCategory ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceCategory $serviceCategory)
    {
        return $this->repository->show($serviceCategory?->id);
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
    public function filter($serviceCategories, $request)
    {
        if ($request->field && $request->sort) {
            $serviceCategories = $serviceCategories->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $serviceCategories = $serviceCategories->where('status', $request->status);
        }

        if ($request->service_id) {
            $service_id = $request->service_id;
            $serviceCategories = $serviceCategories?->where('service_id', $service_id)?->where('status', true);
        }

        if ($request->type == 'web') {
            $service_id = $request->service_id;
            $serviceCategories = $serviceCategories?->whereNotIn('type', ['rental', 'package'])?->where('service_id', $service_id)?->where('status', true);
        }

        return $serviceCategories;
    }
}
