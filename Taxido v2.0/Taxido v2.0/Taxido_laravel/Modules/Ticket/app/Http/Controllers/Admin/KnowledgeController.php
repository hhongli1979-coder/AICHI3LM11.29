<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use App\Models\Attachment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Ticket\Models\Knowledge;
use Modules\Ticket\Tables\KnowledgeTable;
use Modules\Ticket\Repositories\Admin\KnowledgeRepository;
use Modules\Ticket\Http\Requests\Admin\UpdateKnowledgeRequest;
use Modules\Ticket\Http\Requests\Admin\CreateKnowledgeRequest;

class KnowledgeController extends Controller
{
    private $repository;

    public function __construct(KnowledgeRepository $repository)
    {
        $this->authorizeResource(Knowledge::class, 'knowledge');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(KnowledgeTable $knowledgeTable)
    {
        return $this->repository->index($knowledgeTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('ticket::admin.knowledge.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateKnowledgeRequest $request)
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
    public function edit(Knowledge $knowledge)
    {
        return view('ticket::admin.knowledge.edit', ['knowledge' => $knowledge]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKnowledgeRequest $request, Knowledge $knowledge)
    {
        return $this->repository->update($request->all(), $knowledge->id);
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
    public function destroy(Knowledge $knowledge)
    {
        return $this->repository->destroy($knowledge->id);
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

    public function createMedia()
    {
        $media = new Attachment();
        $media->save();
        return $media;
    }

    public function storeFile($file, $model, $collectionName)
    {
        $mediaItem = $model->addMedia($file)->toMediaCollection($collectionName);
        $mediaURL = getMedia($mediaItem->id)->original_url;
        return $mediaURL;
    }

    public function addMedia($model, $media, $collectionName)
    {
        return $model->addMedia($media)->toMediaCollection($collectionName);
    }

    public function uploadImage(Request $request)
    {
        $media = $this->createMedia();
        if ($request->hasFile('file')) {
            $media = $this->storeFile($request->file, $media, 'attachment');
            return response()->json(['location' => url($media)], 200);
        }
    }

}
