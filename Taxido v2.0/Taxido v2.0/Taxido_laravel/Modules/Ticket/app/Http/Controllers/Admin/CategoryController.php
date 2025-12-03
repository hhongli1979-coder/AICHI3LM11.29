<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Category;
use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Admin\CategoryRepository;
use Modules\Ticket\Http\Requests\Admin\UpdateCategoryRequest;
use Modules\Ticket\Http\Requests\Admin\CreateCategoryRequest;

class CategoryController extends Controller
{
    private $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->authorizeResource(Category::class, 'category');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->repository->index();
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
    public function store(CreateCategoryRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return $this->repository->edit($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        return $this->repository->update($request->all(), $category->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        return $this->repository->destroy($category->id);
    }

    public function updateOrders(Request $request)
    {
       return $this->repository->updateOrders($request->all());
    }

    public function slug(Request $request)
    {
        return $this->repository->slug($request);
    }
}
