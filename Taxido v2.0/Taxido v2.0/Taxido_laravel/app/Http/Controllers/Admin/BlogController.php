<?php

namespace App\Http\Controllers\Admin;

use App\Models\Blog;
use App\Tables\BlogTable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\BlogRepository;
use App\Http\Requests\Admin\CreateBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;

class BlogController extends Controller
{
    private $repository;

    public function __construct(BlogRepository $repository)
    {
        $this->authorizeResource(Blog::class, 'blog');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(BlogTable $blogTable)
    {
        return $this->repository->index($blogTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.blog.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBlogRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        return view('admin.blog.edit', ['blog' => $blog]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlogRequest $request, Blog $blog)
    {
        return $this->repository->update($request->all(), $blog->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        return $this->repository->destroy($blog->id);
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
