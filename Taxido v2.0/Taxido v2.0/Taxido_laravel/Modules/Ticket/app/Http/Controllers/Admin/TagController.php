<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Tag;
use Modules\Ticket\Tables\TagTable;
use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Admin\TagRepository;
use Modules\Ticket\Http\Requests\Admin\CreateTagRequest;

class TagController extends Controller
{
    private $repository;

    public function __construct(TagRepository $repository)
    {
        $this->authorizeResource(Tag::class, 'tag');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(TagTable $tagTable)
    {
        return $this->repository->index($tagTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('ticket::admin.tag.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTagRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag, TagTable $tagTable)
    {
        return $this->repository->edit($tag, $tagTable->generate());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        return $this->repository->update($request->all(), $tag->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        return $this->repository->destroy($tag->id);
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
