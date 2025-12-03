<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class TagRepository extends BaseRepository
{
    function model()
    {
        return Tag::class;
    }

    public function index($tagTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.tag.index',['tableConfig' => $tagTable]);
    }


    public function edit($tag, $tagTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.tag.edit',['tableConfig' => $tagTable, 'tag'=> $tag]);
    }   

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $tag = $this->model->create([
                'name' => $request->name,
                'description' => $request->description,
                'status' => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $tag->setTranslation('name', $locale, $request['name']);
            $tag->setTranslation('description', $locale, $request['description']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.tag.edit', ['tag' => $tag->id, 'locale' => $locale])
                    ->with('success', __('static.tags.create_successfully'));
            }

            return to_route('admin.tag.index')->with('success', __('static.tags.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $tag = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (array_key_exists('name', $request)) {
                $tag->setTranslation('name', $locale, $request['name']);
            }

            if (array_key_exists('description', $request)) {
                $tag->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['name', 'description', 'locale']));
            $tag->update($data);

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.tag.edit', ['tag' => $tag->id, 'locale' => $locale])
                    ->with('success', __('static.tags.update_successfully'));
            }

            return to_route('admin.tag.index')->with('success', __('static.tags.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function destroy($id)
    {
        try {

            $tag = $this->model->findOrFail($id);
            $tag->destroy($id);

            return redirect()->route('admin.tag.index')->with('success', __('static.tags.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $tag = $this->model->findOrFail($id);
            $tag->update(['status' => $status]);

            return json_encode(["resp" => $tag]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', __('static.tags.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->forceDelete();

            return redirect()->back()->with('success', __('static.tags.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}






