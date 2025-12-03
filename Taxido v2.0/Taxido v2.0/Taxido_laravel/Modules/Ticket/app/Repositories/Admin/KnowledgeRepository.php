<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Ticket\Models\Knowledge;
use Prettus\Repository\Eloquent\BaseRepository;
use Cviebrock\EloquentSluggable\Services\SlugService;

class KnowledgeRepository extends BaseRepository
{
    function model()
    {
        return Knowledge::class;
    }

    public function index($knowledgeTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.knowledge.index', ['tableConfig' => $knowledgeTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $knowledge =  $this->model->create([
                'title' => $request->title,
                'content' => $request->content,
                'knowledge_thumbnail_id'=> $request->knowledge_thumbnail_id,
                'knowledge_meta_image_id'=> $request->knowledge_meta_image_id,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'status' => $request->status,
                'description' => $request->description
            ]);

            $knowledge->knowledge_thumbnail;
            $knowledge->knowledge_meta_image;
            if ($request->categories){
                $knowledge->categories()->attach($request->categories);
                $knowledge->categories;
            }

            if ($request->tags){
                $knowledge->tags()->attach($request->tags);
                $knowledge->tags;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $knowledge->setTranslation('title', $locale, $request['title']);
            $knowledge->setTranslation('description', $locale, $request['description']);
            $knowledge->setTranslation('content', $locale, $request['content']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.knowledge.edit', $knowledge->id)->with('success', __('ticket::static.knowledge.create_successfully'));
            }
            
            return to_route('admin.knowledge.index')->with('success', __('ticket::static.knowledge.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage() , $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $knowledge = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $knowledge->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['description'])) {
                $knowledge->setTranslation('description', $locale, $request['description']);
            }

            if (isset($request['content'])) {
                $knowledge->setTranslation('content', $locale, $request['content']);
            }

            $data = array_diff_key($request, array_flip(['title', 'description', 'content', 'locale']));
            $knowledge->update($data);
            
            if (isset($request['knowledge_thumbnail_id'])) {
                $knowledge->knowledge_thumbnail()->associate($request['knowledge_thumbnail_id']);
                $knowledge->knowledge_thumbnail;
            }

            if (isset($request['categories'])){
                $knowledge->categories()->sync($request['categories']);
                $knowledge->categories;
            }

            if (isset($request['tags'])){
                $knowledge->tags()->sync($request['tags']);
                $knowledge->tags;
            }

            isset($knowledge->created_by)?
                $knowledge->created_by->makeHidden(['permission']): $knowledge;

            DB::commit();
            $knowledge = $knowledge->fresh();

            if (array_key_exists('save', $request)) {
                return to_route('admin.knowledge.edit', $knowledge->id)->with('success', __('ticket::static.knowledge.update_successfully'));
            }

            return to_route('admin.knowledge.index')->with('success', __('ticket::static.knowledge.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $this->model->findOrFail($id)->destroy($id);
            return to_route('admin.knowledge.index')->with('success', __('ticket::static.knowledge.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $knowledge = $this->model->findOrFail($id);
            $knowledge->update(['status' => $status]);

            return json_encode(["resp" => $knowledge]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', __('ticket::static.knowledge.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->forceDelete();

            return redirect()->back()->with('success', __('ticket::static.knowledge.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function slug($request)
    {
        try {

            $slug = '';
            if (filled($request->title)) {
                $slug = SlugService::createSlug($this->model, 'slug', $request->title);
            }

            return response()->json(['slug' => $slug]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
