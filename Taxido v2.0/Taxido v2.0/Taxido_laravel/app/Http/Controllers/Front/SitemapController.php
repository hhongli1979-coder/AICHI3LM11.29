<?php

namespace App\Http\Controllers\Front;

use App\Models\Blog;
use App\Models\Page;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url; 
use App\Http\Controllers\Controller;

class SitemapController extends Controller
{
    public function generate()
    {
        $sitemap = Sitemap::create();

        
        Blog::all()->each(function (Blog $blog) use ($sitemap) {
            $sitemap->add(
                Url::create("/blog/{$blog->slug}")
                    ->setPriority(0.9) 
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY) 
                    ->setLastModificationDate($blog->updated_at)
            );
        });
    
        Page::all()->each(function (Page $page) use ($sitemap) {
            $sitemap->add(
                Url::create("/page/{$page->slug}")
                    ->setPriority(0.8) 
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                    ->setLastModificationDate($page->updated_at)
            );
        });
    
        return response($sitemap->render())
            ->header('Content-Type', 'application/xml');
    }
}
