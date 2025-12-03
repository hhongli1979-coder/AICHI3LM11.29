<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Banner;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Modules\Taxido\Repositories\Api\BannerRepository;

class BannerController extends Controller
{
    public $repository;

    public function  __construct(BannerRepository $repository)
    {
        $this->authorizeResource(Banner::class, 'banner', [
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

            $banner = $this->filter($this->repository, $request);
            return $banner->latest('created_at')->paginate($request->paginate ?? $banner->count() ?: null );

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
    public function show(Banner $banner)
    {
        return $this->repository->show($banner?->id);
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

    public function filter($banner, $request)
    {
        if ($request->services) {
            $serviceIds = explode(',', $request->services);
            $banner = $banner->whereHas('services', function (Builder $query) use ($serviceIds) {
                $query->whereIn('service_id', $serviceIds);
            });
        }

        if ($request->field && $request->sort) {
            $banner = $banner->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $banner = $banner->where('status', $request->status);
        }

        return $banner;
    }
}
