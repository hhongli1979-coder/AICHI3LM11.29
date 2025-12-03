@extends('front.layouts.master')
@use('App\Models\Category')
@use('App\Models\Tag')
@use('App\Models\Blog')
@php
    $locale = Session::get('front-locale', getDefaultLangLocale());
    $categories = Category::where('status', true)->get();
    $categories = $categories ? $categories->map(fn($category) => $category->toArray($locale))->toArray() : [];

    $tags = Tag::where('status', true)->paginate(10);
    $tags = $tags ? $tags->map(fn($tag) => $tag->toArray($locale))->toArray() : [];

    // Fetch filtered blogs
    $categorySlug = request('category');
    $tagSlug = request('tag');
    $query = Blog::with(['blog_thumbnail'])?->where('status', true);
    if ($categorySlug) {
        $query->whereHas('categories', fn($q) => $q->where('slug', $categorySlug));
    }

    if ($tagSlug) {
        $query->whereHas('tags', fn($q) => $q->where('slug', $tagSlug));
    }

    $blogs = $query->paginate(9);
    $recentBlogs = $blogs ? $blogs?->map(function ($blog) use ($locale) {
        return $blog->toArray($locale);
    })?->toArray() : [];

@endphp
@section('title', __('static.blogs.all_blogs'))
@section('content')
    {{-- Blog List Section Start --}}
    <section id="blog" class="blog-list-section section-b-space">
        <div class="container">
            <div class="row g-sm-4 g-3">
                <div class="col-xxl-3 col-lg-4">
                    <form class="blog-sidebar-box">
                        <div class="category-list-box">
                            <div class="blog-title">
                                <h3>Category</h3>
                            </div>

                            <ul class="category-list">
                                @forelse($categories as $category)
                                    <li>
                                        <a href="{{ route('web.blog.index', ['category' => $category['slug']]) }}"
                                            class="{{ request('category') == $category['slug'] ? 'active' : '' }}">
                                            {{ @$category['name'] }}
                                        </a>
                                    </li>
                                @empty
                                    <li>No Categories Found</li>
                                @endforelse
                            </ul>
                        </div>

                        <div class="recent-post-box">
                            <div class="blog-title">
                                <h3>{{ __('static.blogs.all_blogs') }}</h3>
                            </div>

                            <ul class="recent-blog-list">
                                @forelse($recentBlogs as $blog)
                                    <li class="recent-box">
                                        <a href="#!" class="recent-image">
                                            <img src="{{ asset(@$blog['blog_thumbnail']['original_url'] ?? '') }}"
                                                class="img-fluid recent-image" alt="">
                                        </a>
                                        <div class="post-content">
                                            <h5>
                                                <a href="#!">{{ @$blog['title'] ?? '' }}</a>
                                            </h5>
                                            <h6><i class="ri-calendar-line"></i>
                                                {{ @$blog['created_at'] ? \Carbon\Carbon::parse($blog['created_at'])->format('d M, Y') : '' }}
                                            </h6>
                                        </div>
                                    </li>
                                @empty
                                @endforelse
                            </ul>
                        </div>

                        <div class="tags-list-box">
                            <div class="blog-title">
                                <h3>Tags</h3>
                            </div>
                            <ul class="tags-list">
                                @forelse($tags as $tag)
                                    <li>
                                        <a href="{{ route('web.blog.index', ['tag' => $tag['slug']]) }}"
                                            class="{{ request('tag') == $tag['slug'] ? 'active' : '' }}">
                                            {{ @$tag['name'] }}
                                        </a>
                                    </li>
                                @empty
                                    <li>No Tags Found</li>
                                @endforelse
                            </ul>
                        </div>
                    </form>
                </div>

                <div class="col-xxl-9 col-lg-8">
                    <div class="row g-sm-4 g-3">
                        @forelse ($blogs as $blog)
                            <div class="col-12">
                                <div class="blog-box">
                                    <a href="{{ route('blog.slug', @$blog['slug']) }}" class="blog-img">
                                        <img class="img-fluid"
                                            src="{{ asset($blog['blog_thumbnail']['original_url'] ?? '') }}"
                                            alt="">
                                    </a>
                                    <div class="blog-details">
                                        <h4>
                                            <a
                                                href="{{ route('blog.slug', @$blog['slug']) }}">{{ @$blog['title'] ?? '' }}</a>
                                        </h4>
                                        <p>{{ @$blog['description'] ?? '' }}</p>
                                        <button onclick="location.href = '{{ route('blog.slug', @$blog['slug']) }}';"
                                            class="link-btn btn">Know More</button>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <p>Not Blogs Found</p>
                        @endforelse
                    </div>

                    <div class="pagination-box">
                        {{ $blogs->links() }}
                    </div>
                </div>
            </div>
        </div>
    </section>
    {{-- Blog List Section End --}}
@endsection
