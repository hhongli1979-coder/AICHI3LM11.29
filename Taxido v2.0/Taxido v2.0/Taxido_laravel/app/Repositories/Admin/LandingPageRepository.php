<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\LandingPage;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class LandingPageRepository extends BaseRepository
{
    public function model()
    {
        return LandingPage::class;
    }

    public function index()
    {
        try {

            $content = LandingPage::first()?->value('content');
            return view('admin.landing-page.index', ['id' => $this->model->pluck('id')->first(), 'content' => $content]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getSubscribes($subscribesTable)
    {
        if (request()['action']) {
            return redirect()?->back();
        }
        return view('admin.landing-page.subscribes',['tableConfig' => $subscribesTable]);

    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $landingPage = $this->model->findOrFail($id);
            $fields = [
                'header' => ['logo'],
                'home' => ['bg_image','left_phone_image','right_phone_image'],
                'footer' => ['footer_logo','right_image'],
                'seo' => ['meta_image'],
            ];

            foreach ($fields as $section => $imageFields) {
                $this->processFields($request, $landingPage, $section, $imageFields);
            }

            $sections = [
                'statistics' => ['counters' => 'icon'],
                'feature' => ['images' => 'image'],
                'ride' => ['step' => 'image'],
            ];

            $this->processSectionImages($request, $landingPage, $sections);
            $locale = $request['locale'] ?? app()->getLocale();
            $landingPage->setTranslation('content', $locale , $request);
            $landingPage->update(['content' => $request]);

            DB::commit();
            return to_route('admin.landing-page.index')->with('success', __('static.landing_pages.update_successfully'));

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function processSectionImages(&$request, $landingPage, array $sections)
    {
        foreach ($sections as $section => $subSections) {
            foreach ($subSections as $subSection => $imageField) {
                $items = $request[$section][$subSection] ?? [];

                foreach ($items as $key => $item) {
                    if (isset($item[$imageField]) && $item[$imageField]) {

                        $media = $this->storeImage($item[$imageField]);
                        $request[$section][$subSection][$key][$imageField] = $media->asset_url;

                    } else {
                        $request[$section][$subSection][$key][$imageField] = $landingPage->content[$section][$subSection][$key][$imageField] ?? null;
                    }
                }
            }
        }
    }

    private function processFields(&$request, $landingPage, $section, array $fields)
    {
        foreach ($fields as $field) {
            $requestValue = $request[$section][$field] ?? null;

            if ($requestValue) {
                $media = $this->storeImage($requestValue);
                $request[$section][$field] = $media->asset_url;
            } else {
                $request[$section][$field] = $landingPage->content[$section][$field] ?? null;
            }
        }
    }

    public function storeImage($request)
    {
        $attachments = createAttachment();
        $media = addMedia($attachments, $request);

        $attachments->delete($attachments->id);
        return $media;
    }
}



