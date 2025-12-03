<?php

namespace App\Repositories\Front;

use Exception;
use App\Models\Blog;
use App\Models\LandingPage;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Session;
use Prettus\Repository\Eloquent\BaseRepository;

class BlogRepository extends BaseRepository
{
    public function model()
    {
        return Blog::class;
    }

    public function getBlogBySlug($slug)
    {
        try {
            $locale  = Session::get('front-locale', getDefaultLangLocale());
            $content = LandingPage::first();
            $content = $content ? $content->toArray($locale) : [];
            $content = $content['content'];
            $blog = $this->model?->with(['tags', 'blog_thumbnail','blog_meta_image', 'categories'])->where('slug', $slug)?->first()?->toArray($locale);
            return view('front.blogs.details', ['blog' => $blog, 'content' => $content]);

        } catch (Exception $e) {

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

            $categorySlug = request('category');
            $tagSlug      = request('tag');

            $query = $this->model->where('status', 1);

            if ($categorySlug) {
                $query->whereHas('categories', function ($q) use ($categorySlug) {
                    $q->where('slug', $categorySlug);
                });
            }

            if ($tagSlug) {
                $query->whereHas('tags', function ($q) use ($tagSlug) {
                    $q->where('slug', $tagSlug);
                });
            }

            $blogs = $query->paginate(6);

            return view('front.blogs.index', [
                'blogs'    => $blogs,
                'content'  => $content,
                'category' => $categorySlug,
                'tag'      => $tagSlug,
            ]);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
