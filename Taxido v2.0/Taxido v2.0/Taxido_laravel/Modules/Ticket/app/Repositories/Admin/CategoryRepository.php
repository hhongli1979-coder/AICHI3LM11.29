<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\Category;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Cviebrock\EloquentSluggable\Services\SlugService;

class CategoryRepository extends BaseRepository
{
    function model()
    {
       return Category::class;
    }

    public function index()
    {
        $parent = $this->model->getHierarchy();
        $categories = $this->model->whereNull('parent_id')->orderBy('sort_order', 'ASC')->get();
        return view('ticket::admin.category.index', ['categories' => $categories, 'parent' => $parent]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            
           
            $category =  $this->model->create([
                'name' => $request->name,
                'description' => $request->description,
                'type' => $request->type ?? 'post',
                'status' => $request->status,
                'category_image_id' => $request->category_image_id,
                'category_meta_image_id'   => $request->category_meta_image_id,
                'parent_id' => $request->parent_id,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
            ]);

            if (filled($request->slug)) {
                $category->slug = $request->slug;
                $category->save();
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $category->setTranslation('name', $locale, $request['name']);
            $category->setTranslation('description', $locale, $request['description']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.ticket.category.edit', ['category' => $category->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.categories.create_successfully'));
            }

            return to_route('admin.ticket.category.index')->with('success', __('ticket::static.categories.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function edit($category)
    {
        $parent = $this->model->getHierarchy();
        $categories = $this->model->whereNull('parent_id')->orderBy('sort_order', 'ASC')->get();
        return view('ticket::admin.category.edit', ['cat' => $category, 'parent' => $parent, 'categories' =>  $categories]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $category = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['name'])) {
                $category->setTranslation('name', $locale, $request['name']);
            }

            if (isset($request['description'])) {
                $category->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['name', 'description', 'locale']));
            $category->update($data);

            $category->category_image()->associate($request['category_image_id'] ?? null);
            $category->category_meta_image()->associate($request['category_meta_image_id'] ?? null);
            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.ticket.category.edit', ['category' => $category->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.categories.update_successfully'));
            }

            return to_route('admin.ticket.category.index')->with('success', __('ticket::static.categories.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $category = $this->model->findOrFail($id);
            $category->update(['status' => $status]);

            return $category;

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $this->model->findOrFail($id)?->destroy($id);
            return redirect()->route('admin.ticket.category.index')->with('success', __('ticket::static.categories.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateOrders($data)
    {
        DB::beginTransaction();

        try {

            foreach($data['categories'] as $cat) {
                $category = $this->model->findOrFail($cat['id']);
                $category->update([
                    'parent_id' => $cat['parent_id'] ?? null,
                    'sort_order' => $cat['order']
                ]);
            }

            DB::commit();

            return json_encode(array("resp" => [$data['categories'], $category]));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function slug($request)
    {
        try {

            $slug = '';
            if (filled($request->name)) {
                $slug = SlugService::createSlug($this->model, 'slug', $request->name);
            }

            return response()->json(['slug' => $slug]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
