<?php

namespace App\Http\Controllers\Admin;

use App\Models\Faq;
use App\Tables\FaqTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\FaqRepository;

class FaqController extends Controller
{
    public $repository;
    
    public function __construct(FaqRepository $repository)
    {
        $this->authorizeResource(Faq::class,'faq');
        $this->repository = $repository;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(FaqTable $faqTable)
    {
        return $this->repository->index($faqTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.faq.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
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
    public function edit(Faq $faq)
    {
        return view('admin.faq.edit',['faq' => $faq]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        return $this->repository->update($request->all(),$faq->id);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        return $this->repository->destroy($faq->id);
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
