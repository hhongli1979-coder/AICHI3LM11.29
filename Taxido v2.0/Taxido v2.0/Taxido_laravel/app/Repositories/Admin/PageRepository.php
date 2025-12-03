<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Page;
use App\Imports\PageImport;
use App\Exports\PagesExport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Http;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;
use Cviebrock\EloquentSluggable\Services\SlugService;

class PageRepository extends BaseRepository
{
    function model()
    {
        return Page::class;
    }

    public function index($pageTable)
    {

        if (request()['action']) {
            return redirect()->back();
        }

        return view('admin.page.index',['tableConfig' => $pageTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $page = $this->model->create([
                'title' => $request->title,
                'content' => $request->content,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'page_meta_image_id' => $request->page_meta_image_id,
                'status' => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $page->setTranslation('title', $locale, $request['title']);
            $page->setTranslation('content', $locale, $request['content']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.page.edit', [$page->id,'locale' => $locale])->with('success', __('static.pages.create_successfully'));
            }

            return to_route('admin.page.index')->with('success', __('static.pages.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $page = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $page->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['content'])) {
                $page->setTranslation('content', $locale, $request['content']);
            }

            $data = array_diff_key($request, array_flip(['title', 'content', 'locale']));
            $page->update($data);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.page.edit', [$page->id,'locale' => $locale])->with('success', __('static.pages.update_successfully'));
            }

            return to_route('admin.page.index')->with('success', __('static.pages.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function destroy($id)
    {
        try {

            $this->model->findOrFail($id)->destroy($id);
            return redirect()->route('admin.page.index')->with('success', __('static.pages.delete_successfully'));

        } catch (Exception $e){

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $page = $this->model->findOrFail($id);
            $page->update(['status' => $status]);

            return json_encode(["resp" => $page]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $page = $this->model->onlyTrashed()->findOrFail($id);
            $page->restore();

            return redirect()->back()->with('success', __('static.pages.restore'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function forceDelete($id)
    {
        try {

            $page = $this->model->onlyTrashed()->findOrFail($id);
            $page->forceDelete();

            return redirect()->back()->with('success', __('static.pages.permanent_delete_successfully'));

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
                return Excel::download(new PagesExport, 'pages.csv');
            }
            return Excel::download(new PagesExport, 'pages.xlsx');
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

                if (!$googleSheetUrl) {
                    throw new Exception(__('static.import.no_url_provided'));
                }

                if (!filter_var($googleSheetUrl, FILTER_VALIDATE_URL)) {
                    throw new Exception(__('static.import.invalid_url'));
                }

                $parsedUrl = parse_url($googleSheetUrl);
                preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $parsedUrl['path'], $matches);
                $sheetId = $matches[1] ?? null;
                parse_str($parsedUrl['query'] ?? '', $queryParams);
                $gid = $queryParams['gid'] ?? 0;

                if (!$sheetId) {
                    throw new Exception(__('static.import.invalid_sheet_id'));
                }

                $csvUrl = "https://docs.google.com/spreadsheets/d/{$sheetId}/export?format=csv&gid={$gid}";

                $response = Http::get($csvUrl);

                if (!$response->ok()) {
                    throw new Exception(__('static.import.failed_to_fetch_csv'));
                }

                $tempFile = tempnam(sys_get_temp_dir(), 'google_sheet_') . '.csv';
                file_put_contents($tempFile, $response->body());
            } elseif ($activeTab === 'local-file') {
                $file = $request->file('fileImport');
                if (!$file) {
                    throw new Exception(__('static.import.no_file_uploaded'));
                }

                if ($file->getClientOriginalExtension() != 'csv') {
                    throw new Exception(__('static.import.csv_file_allow'));
                }

                $tempFile = $file->getPathname();
            } else {
                throw new Exception(__('static.import.no_valid_input'));
            }

            Excel::import(new PageImport(), $tempFile);

            if ($activeTab === 'google_sheet' && file_exists($tempFile)) {
                unlink($tempFile);
            }

            return redirect()->back()->with('success', __('static.import.csv_file_import'));
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
