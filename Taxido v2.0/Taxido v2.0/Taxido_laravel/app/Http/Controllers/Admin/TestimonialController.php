<?php

namespace App\Http\Controllers\Admin;


use App\Models\Testimonial;
use Illuminate\Http\Request;
use App\Tables\TestimonialTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\TestimonialRepository;
use App\Http\Requests\Admin\CreateTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $repository;

    public function __construct(TestimonialRepository $repository)
    {
        $this->authorizeResource(Testimonial::class, 'testimonial');
        $this->repository = $repository;
    }

    public function index(TestimonialTable $testimonialTable)
    {
        return $this->repository->index($testimonialTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.testimonial.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTestimonialRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Testimonial $testimonial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Testimonial $testimonial)
    {
        return view('admin.testimonial.edit', ['testimonial' => $testimonial]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        return $this->repository->update($request->all(), $testimonial->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonial)
    {
        return $this->repository->destroy($testimonial?->id);
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
     * 
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
