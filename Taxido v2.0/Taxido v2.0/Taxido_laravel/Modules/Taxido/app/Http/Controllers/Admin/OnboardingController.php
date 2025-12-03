<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\Onboarding;
use Modules\Taxido\Tables\OnboardingTable;
use Modules\Taxido\Repositories\Admin\OnboardingRepository;

class OnboardingController extends Controller
{
    public $repository;

    public function __construct(OnboardingRepository $repository)
    {
        // $this->authorizeResource(Onboarding::class, 'onboarding');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(OnboardingTable $onboardingTable)
    {
        return $this->repository->index($onboardingTable->generate());
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Onboarding $onboarding)
    {
        return view('taxido::admin.onboarding.edit', ['onboarding' => $onboarding]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Onboarding $onboarding)
    {
        return $this->repository->update($request->all(), $onboarding->id);
    }

    /**
     * Change status of the specified resource.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }
}