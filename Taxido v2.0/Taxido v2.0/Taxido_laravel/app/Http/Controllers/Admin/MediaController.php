<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attachment;
use Illuminate\Http\Request;
use App\Tables\AttachmentTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\MediaRepository;

class MediaController extends Controller
{
    private $repository;

    public function __construct(MediaRepository $repository)
    {
        $this->authorizeResource(Attachment::class, 'media');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(AttachmentTable $attachmentTable, Request $request)
    {
        return $this->repository->index($attachmentTable->generate(), $request);
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
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attachment $attachment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attachment $attachment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,Attachment $media)
    {
        return $this->repository->update($request, $media->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attachment $attachment)
    {
        //
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }

    public function deleteAll(Request $request)
    {
        return $this->repository->deleteAll($request->ids);
    }

    public function ajaxGetMedia(Request $request)
    {
        $media = $this->repository;

        if ($request->ajax()) {
            if ($request->sort) {
                $media = $this->sort($media, $request->sort);
            }

            $paginatedMedia = $media->paginate(30);
            return response()->json([
                'data' => $paginatedMedia->items(),
                'pagination' => $paginatedMedia->links('pagination::bootstrap-4')->render()
            ]);
        }

        return response()->json(['message' => __('static.media.media_not_found')], 404);
    }



    public function sort($media, $sort)
    {
        switch ($sort) {
            case 'newest':
                return $media->latest('created_at');

            case 'oldest':
                return $media->oldest('updated_at');

            case 'smallest':
                return $media->orderBy('size', 'asc');

            case 'largest':
                return $media->orderBy('size', 'desc');

            default:
                return $media;
        }
    }

    public function uploadImage(Request $request)
    {
        return $this->repository->uploadImage($request);
    }

}
