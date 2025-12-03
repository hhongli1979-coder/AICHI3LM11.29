<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\Preference;
use Modules\Taxido\Tables\PreferenceTable;
use Modules\Taxido\Repositories\Admin\PreferenceRepository;
use Modules\Taxido\Http\Requests\Admin\CreatePreferenceRequest;
use Modules\Taxido\Http\Requests\Admin\UpdatePreferenceRequest;

class PreferenceController extends Controller
{
    public $repository;

    public function __construct(PreferenceRepository $repository)
    {
        $this->authorizeResource(Preference::class, 'preference');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(PreferenceTable $preferenceTable)
    {
        return $this->repository->index($preferenceTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.preference.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePreferenceRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Preference $preference)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Preference $preference)
    {
        return view('taxido::admin.preference.edit', ['preference' => $preference]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePreferenceRequest $request, Preference $preference)
    {
        return $this->repository->update($request->all(), $preference->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Preference $preference)
    {
        return $this->repository->destroy($preference->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
