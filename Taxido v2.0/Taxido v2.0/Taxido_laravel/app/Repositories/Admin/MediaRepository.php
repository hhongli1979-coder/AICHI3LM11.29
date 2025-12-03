<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Attachment;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class MediaRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name' => 'like',
        'file_name' => 'like',
        'collection_name' => 'like',
    ];

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    function model()
    {
        return Attachment::class;
    }

    public function index($mediaTable, $request)
    {
        if ($request?->filled('mode') && $request?->mode == 'grid') {
            $files = $this->model->whereNull('deleted_at')?->latest();
            if ($request?->s) {
                $files = $files?->where('name', 'LIKE', "%" . $request?->s . "%");
            }

            if ($request->type) {
                $files = $files?->where('mime_type', 'LIKE', "%" . $request?->type . "%");
            }

            return view('admin.media.index', ['files' => $files?->paginate(55),'mode' => 'grid']);
        }

        return view('admin.media.index', ['tableConfig' => $mediaTable]);
    }


    public function addMedia($model, $media, $collectionName)
    {
        return $model->addMedia($media)->toMediaCollection($collectionName);
    }

    public function createMedia()
    {
        $media = new Attachment();
        $media->save();
        return $media;
    }

    public function storeFile($media, $model, $collectionName)
    {
        $media = $this->addMedia($model, $media, $collectionName);
        $model->delete($model->id);
        return $media->getFirstMediaUrl();
    }

    public function deleteImage($model)
    {
        if(!is_array($model->id)) {
            return $model->forceDelete($model->id);
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store($request)
    {
        $media = $this->createMedia();
        if ($request->hasFile('file')) {
            $media = $this->storeFile($request->file, $media, 'file');
        }

        return redirect()->back();
    }

    public function update($request, $id)
    {
        try {
            DB::beginTransaction();
            $media = $this->model->findOrFail($id);
            $newFileName = $media->renameFile($media, $request);
            $media->update([
                'alternative_text' => $request['alternative'],
                'name' => $request['title'],
                'file_name' => $newFileName,
            ]);
            DB::commit();
            return to_route('admin.media.index', ['mode' => 'grid'])->with('success', __('static.media.update_successfully'));
        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.media.index', ['mode' => 'grid'])->with('error', __('static.media.error_occurred') . $e->getMessage());
        }
    }


    public function forceDelete($id)
    {
        try {

            $attachment = $this->model->findOrFail($id);
            $this->deleteImage($attachment);
            return redirect()->route('admin.media.index')->with('success', __('static.media.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAll($ids)
    {
        try {
            $this->model->whereIn('id', $ids)->forcedelete();
            return response()->json(['success' => true]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function uploadImage($request)
    {
        $media = $this->createMedia();
        if ($request->hasFile('file')) {

            $mediaItem = $media->addMedia($request->file)->toMediaCollection('attachment');
            $mediaURL = getMedia($mediaItem->id)->original_url;

            return response()->json(['location' => $mediaURL], 200);
        }
    }
}
