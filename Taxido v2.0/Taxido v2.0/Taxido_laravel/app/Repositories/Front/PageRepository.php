<?php

namespace App\Repositories\Front;

use Exception;
use App\Models\Page;
use App\Models\LandingPage;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Session;
use Prettus\Repository\Eloquent\BaseRepository;

class PageRepository extends BaseRepository
{
    function model()
    {
        return Page::class;
    }

    public function getPageBySlug($slug)
    {
        try {

            $locale  = Session::get('front-locale', getDefaultLangLocale());
            $content = LandingPage::first();
            $content = $content ? $content->toArray($locale) : [];

            $content = $content['content'];

            $page = $this->model->where('slug',$slug)?->first();
            return view('front.pages.details',['page' => $page,'content' => $content]);
        } catch(Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function index()
    {
        try {
            $locale  = Session::get('front-locale', getDefaultLangLocale());
            $content = LandingPage::first();
            $content = $content ? $content->toArray($locale) : [];

            $content = $content['content'];


            $pages = $this->model->where('status', 1)
                ->paginate(6);

            return view('front.pages.index', ['pages' => $pages, 'content' => $content]);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
