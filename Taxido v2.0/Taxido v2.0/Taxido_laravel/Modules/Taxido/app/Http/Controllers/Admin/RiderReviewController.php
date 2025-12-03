<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\RiderReview;
use Modules\Taxido\Tables\RiderReviewTable;
use Modules\Taxido\Repositories\Admin\RiderReviewRepository;

class RiderReviewController extends Controller
{
    public $repository;

    public function __construct(RiderReviewRepository $repository)
    {
        $this->authorizeResource(RiderReview::class, 'rider_review');
        $this->repository = $repository;
    }

    /** 
     * Display a listing of the resource.
     */
    public function index(RiderReviewTable $riderReviewTable)
    {
        return $this->repository->index($riderReviewTable->generate());
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
    public function destroy(RiderReview $riderReview)
    {
        return $this->repository->destroy($riderReview->id);
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
