<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Document;
use Prettus\Repository\Eloquent\BaseRepository;

class DocumentRepository extends BaseRepository
{
    function model()
    {
        return Document::class;
    }

    public function index($documentTable)
    {

          if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.document.index', ['tableConfig' => $documentTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $document = $this->model->create([
                'name' => $request->name,
                'is_required' => $request->is_required,
                'type' => $request->type,
                'need_expired_date' => $request->need_expired_date,
                'status' => $request->status,
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $document->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.document.edit', [
                    'document' => $document->id,
                    'locale'   => $locale,
                ])->with('success', __('taxido::static.documents.create_successfully'));
            }

            return to_route('admin.document.index')->with('success', __('taxido::static.documents.create_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $document = $this->model->FindOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            $document->setTranslation('name', $locale, $request['name']);

            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $document->update($data);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.document.edit', [
                    'document' => $document->id,
                    'locale'   => $locale,
                ])->with('success', __('taxido::static.documents.update_successfully'));
            }

            return to_route('admin.document.index')->with('success', __('taxido::static.documents.update_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $document = $this->model->findOrFail($id);
            $document->destroy($id);

            return redirect()->route('admin.document.index')->with('success', __('taxido::static.documents.delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $document = $this->model->findOrFail($id);
            $document->update(['status' => $status]);

            return json_encode(["resp" => $document]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $document = $this->model->onlyTrashed()->findOrFail($id);
            $document->restore();

            return redirect()->back()->with('success', __('taxido::static.documents.restore_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $document = $this->model->onlyTrashed()->findOrFail($id);
            $document->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.documents.permanent_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
