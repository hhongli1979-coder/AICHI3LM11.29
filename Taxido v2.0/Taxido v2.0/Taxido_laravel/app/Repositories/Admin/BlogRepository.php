<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Blog;
use App\Imports\BlogImport;
use App\Exports\BlogsExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Facades\Excel;
use Prettus\Repository\Eloquent\BaseRepository;
use Cviebrock\EloquentSluggable\Services\SlugService;

class BlogRepository extends BaseRepository
{
    public function model()
    {
        return Blog::class;
    }

    public function index($blogTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.blog.index', ['tableConfig' => $blogTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $blog = $this->model->create([
                'title' => $request->title,
                'content'=> $request->content,
                'blog_thumbnail_id'  => $request->blog_thumbnail_id,
                'blog_meta_image_id' => $request->blog_meta_image_id,
                'meta_title'   => $request->meta_title,
                'meta_description'  => $request->meta_description,
                'is_featured' => $request->is_featured,
                'is_sticky' => $request->is_sticky,
                'status' => $request->status,
                'description' => $request->description,
            ]);

            $blog->blog_thumbnail;
            $blog->blog_meta_image;
            if ($request->categories) {
                $blog->categories()->attach($request->categories);
                $blog->categories;
            }

            if ($request->tags) {
                $blog->tags()->attach($request->tags);
                $blog->tags;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $blog->setTranslation('title', $locale, $request['title']);
            $blog->setTranslation('description', $locale, $request['description']);
            $blog->setTranslation('content', $locale, $request['content']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.blog.edit', ['blog' => $blog->id, 'locale' => $locale])
                    ->with('success', __('static.blogs.create_successfully'));
            }

            return to_route('admin.blog.index')->with('success', __('static.blogs.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $blog   = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $blog->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['description'])) {
                $blog->setTranslation('description', $locale, $request['description']);
            }

            if (isset($request['content'])) {
                $blog->setTranslation('content', $locale, $request['content']);
            }

            $data = array_diff_key($request, array_flip(['title', 'description', 'content', 'locale']));
            $blog->update($data);

            if (isset($request['blog_thumbnail_id'])) {
                $blog->blog_thumbnail()->associate($request['blog_thumbnail_id']);
                $blog->blog_thumbnail;
            }

            if (isset($request['categories'])) {
                $blog->categories()->sync($request['categories']);
                $blog->categories;
            }

            if (isset($request['tags'])) {
                $blog->tags()->sync($request['tags']);
                $blog->tags;
            }

            isset($blog->created_by) ?
            $blog->created_by->makeHidden(['permission']) : $blog;

            DB::commit();
            $blog = $blog->fresh();

            if (array_key_exists('save', $request)) {
                return to_route('admin.blog.edit', ['blog' => $blog->id, 'locale' => $locale])
                    ->with('success', __('static.blogs.update_successfully'));
            }

            return to_route('admin.blog.index')->with('success', __('static.blogs.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $this->model->findOrFail($id)->destroy($id);
            return redirect()->route('admin.blog.index')->with('success', __('static.blogs.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $blog = $this->model->findOrFail($id);
            $blog->update(['status' => $status]);

            return json_encode(["resp" => $blog]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', __('static.blogs.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->forceDelete();

            return redirect()->back()->with('success', __('static.blogs.permanent_delete_successfully'));

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

    public function export($request)
    {
        try {
            $format = $request->input('format', 'xlsx');

            if ($format == 'csv') {
                return Excel::download(new BlogsExport, 'blogs.csv');
            }
            return Excel::download(new BlogsExport, 'blogs.xlsx');
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function import($request)
    {
        try {
            $activeTab = $request->input('active_tab');

            $tempFile = null;

            if ($activeTab === 'direct-link') {

                $googleSheetUrl = $request->input('google_sheet_url');

                if (! $googleSheetUrl) {
                    throw new Exception(__('static.import.no_url_provided'));
                }

                if (! filter_var($googleSheetUrl, FILTER_VALIDATE_URL)) {
                    throw new Exception(__('static.import.invalid_url'));
                }

                $parsedUrl = parse_url($googleSheetUrl);
                preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $parsedUrl['path'], $matches);
                $sheetId = $matches[1] ?? null;
                parse_str($parsedUrl['query'] ?? '', $queryParams);
                $gid = $queryParams['gid'] ?? 0;

                if (! $sheetId) {
                    throw new Exception(__('static.import.invalid_sheet_id'));
                }

                $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";

                $response = Http::get($csvUrl);

                if (! $response->ok()) {
                    throw new Exception(__('static.import.failed_to_fetch_csv'));
                }

                $tempFile = tempnam(sys_get_temp_dir(), 'google_sheet_') . '.csv';
                file_put_contents($tempFile, $response->body());
            } elseif ($activeTab === 'local-file') {
                $file = $request->file('fileImport');
                if (! $file) {
                    throw new Exception(__('static.import.no_file_uploaded'));
                }

                if ($file->getClientOriginalExtension() != 'csv') {
                    throw new Exception(__('static.import.csv_file_allow'));
                }

                $tempFile = $file->getPathname();
            } else {
                throw new Exception(__('static.import.no_valid_input'));
            }

            Excel::import(new BlogImport(), $tempFile);

            if ($activeTab === 'google_sheet' && file_exists($tempFile)) {
                unlink($tempFile);
            }

            return redirect()->back()->with('success', __('static.import.csv_file_import'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
