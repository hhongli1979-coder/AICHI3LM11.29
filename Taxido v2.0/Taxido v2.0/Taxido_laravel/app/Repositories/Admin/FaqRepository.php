<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Faq;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class FaqRepository extends BaseRepository
{
    function model()
    {
        return Faq::class;
    }

    public function index($faqTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        return view('admin.faq.index', ['tableConfig' => $faqTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            foreach ($request->faqs as $faqData) {
                $faq = $this->model->create([
                    'title' => $faqData['title'],
                    'description' => $faqData['description'],
                ]);

                $locale = $request['locale'] ?? app()->getLocale();

                $faq->setTranslation('title', $locale, $faqData['title']);
                $faq->setTranslation('description', $locale, $faqData['description']);
            }

            DB::commit();

            return to_route('admin.faq.index')->with('success', __('static.faqs.create_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


   public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            
            $faq = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $faq->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['description'])) {
                $faq->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['title', 'description', 'locale']));
            $faq->update($data);

            DB::commit();

            return to_route('admin.faq.index')->with('success', __('static.faqs.update_successfully'));
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $faq = $this->model->findOrFail($id);
            $faq->destroy($id);

            return redirect()->route('admin.faq.index')->with('success', __('static.faqs.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $faq = $this->model->onlyTrashed()->findOrFail($id);
            $faq->restore();

            return redirect()->back()->with('success', __('static.faqs.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $faq = $this->model->onlyTrashed()->findOrFail($id);
            $faq->forceDelete();

            return redirect()->back()->with('success', __('static.faqs.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
