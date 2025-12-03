<?php

namespace App\Http\Controllers\Admin;

use App\Models\Page;
use App\Tables\PageTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\PageRepository;
use App\Http\Requests\Admin\CreatePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public $repository;

    public function __construct(PageRepository $repository)
    {
        $this->authorizeResource(Page::class, 'page');
        $this->repository = $repository;
    }

    public function index(PageTable $pageTable)
    {
        return $this->repository->index($pageTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.page.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePageRequest $request)
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
    public function edit(Page $page)
    {
        return view('admin.page.edit',['page' => $page]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePageRequest $request, Page $page)
    {
        return $this->repository->update($request->all(), $page->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        return $this->repository->destroy($page->id);
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
     * 
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }

    public function slug(Request $request)
    {
        return $this->repository->slug($request);
    }

    public function export(Request $request)
    {
        return $this->repository->export($request);
    }

    public function import(Request $request)
    {
        return $this->repository->import($request);
    }

}
