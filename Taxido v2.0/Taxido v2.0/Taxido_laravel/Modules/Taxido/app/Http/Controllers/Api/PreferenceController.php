<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Http\Resources\PreferenceResource;
use Modules\Taxido\Models\Preference;
use Modules\Taxido\Repositories\Api\PreferenceRepository;

class PreferenceController extends Controller
{
    public $repository;

    public function  __construct(PreferenceRepository $repository)
    {
        $this->authorizeResource(Preference::class, 'preference', [
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

            $preference = $this->filter($this->repository, $request);
            $preference = $preference->latest('created_at')->paginate($request->paginate ?? $preference->count() ?: null );
            return PreferenceResource::collection($preference?? []);

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
    public function show(Preference $preference)
    {
        return $this->repository->show($preference?->id);
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

    public function filter($preference, $request)
    {
        if ($request->field && $request->sort) {
            $preference = $preference->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $preference = $preference->where('status', $request->status);
        }

        return $preference;
    }
}
