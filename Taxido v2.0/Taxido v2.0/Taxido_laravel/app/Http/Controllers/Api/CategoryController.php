<?php

namespace App\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use App\Repositories\Api\CategoryRepository;

class CategoryController extends Controller
{

    public $repository;

    public function __construct(CategoryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try{

            $categories = $this->filter($this->repository,$request);
            return $categories->latest('created_at')->paginate($request->paginate ?? $categories->count() ?: null);

        } catch(Exception $e) {

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
    public function show($id)
    {
        return $this->repository->findOrFail($id);
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

    public function getCategoryBySlug($slug)
    {
        return $this->repository->getCategoryBySlug($slug);
    }

    public function filter($categories, $request)
    {
        if ($request->field && $request->sort) {
            $categories = $categories->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $categories = $categories->where('status', $request->status);
        }

        return $categories;
    }
}
