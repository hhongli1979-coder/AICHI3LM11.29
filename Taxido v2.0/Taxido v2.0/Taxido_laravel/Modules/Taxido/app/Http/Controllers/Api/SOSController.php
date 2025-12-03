<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\SOS;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Http\Resources\SOSResource;
use Modules\Taxido\Repositories\Api\SOSRepository;

class SOSController extends Controller
{
    public $repository;

    public function  __construct(SOSRepository $repository)
    {
        $this->authorizeResource(SOS::class, 'sos', [
            'except' => ['index', 'show'],
        ]);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $sos = $this->filter($this->repository, $request);
            $sos = $sos->latest('created_at')->simplePaginate($request->paginate ?? $sos->count() ?: null);
            return SOSResource::collection($sos ?? []);

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
    public function show(SOS $sos)
    {
        return $this->repository->show($sos?->id);
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

    public function filter($sos, $request)
    {
        if ($request->field && $request->sort) {
            $sos = $sos->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $sos = $sos->where('status', $request->status);
        }

        return $sos;
    }
}
