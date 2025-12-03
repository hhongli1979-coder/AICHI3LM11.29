@extends('front.layouts.master')
@use('App\Models\Category')
@use('App\Models\Tag')
@use('App\Models\Blog')
@php
    $locale = Session::get('front-locale', getDefaultLangLocale());
    $categories = Category::where('status', true)?->whereNull('deleted_at')?->get();
    $categories = $categories ? $categories->map(function ($category) use ($locale) {
        return $category->toArray($locale);
    })->toArray() : [];

    $tags = Tag::where('status', true)->paginate(10);

    $tags = $tags ? $tags->map(function ($tag) use ($locale) {
        return $tag->toArray($locale);
    })->toArray() : [];

    $blogs = Blog::with(['blog_thumbnail'])?->where('status', true)->paginate(5);

    $recentBlogs = $blogs ? $blogs->map(function ($blog) use ($locale) {
        return $blog->toArray($locale);
    })->toArray() : [];
@endphp


@section('title', __('static.blogs.blog'))
@section('content')

<body>
    {{-- Blog Details Section Start --}}
    <section class="blog-details-section section-b-space">
        <div class="container">
            <div class="row">
                <div class="col-xl-9">
                    <div class="blog-box">
                        <div class="blog-image">
                            <img class="img-fluid" src="{{ asset(@$blog['blog_thumbnail']['original_url'] ?? '') }}"
                                 alt="{{ @$blog['title'] ?? 'Blog Image' }}">
                        </div>
                        <div class="blog-title">
                            <ul class="top-title">
                                <li>
                                    <i class="ri-calendar-line"></i>
                                    {{ @$blog['created_at'] ? \Carbon\Carbon::parse(@$blog['created_at'])->format('d M, Y') : '' }}
                                </li>
                                <li>By <span>{{ @$blog['created_by']['name'] }}</span></li>
                                <li>
                                    @foreach ($blog['tags'] as $tag)
                                        <span class="badge">{{ @$tag['name'] }}</span>
                                    @endforeach
                                </li>
                            </ul>
                            <h1>{{ @$blog['title'] ?? '' }}</h1>
                            <p>{!! @$blog['description'] !!}</p>
                        </div>
                        <div class="blog-contain">
                            {!! @$blog['content'] ?? '' !!}
                        </div>
                    </div>
                </div>

                <div class="col-xl-3">
                    <form class="blog-sidebar-box">
                        {{-- Category Filter --}}
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

                        {{-- Recent Posts --}}
                        <div class="recent-post-box">
                            <div class="blog-title">
                                <h3>Recent Posts</h3>
                            </div>
                            <ul class="recent-blog-list">
                                @forelse($recentBlogs as $blog)
                                    <li class="recent-box">
                                        <a href="{{ route('blog.slug', ['slug' => $blog['slug']]) }}" class="recent-image">
                                            <img src="{{ asset(@$blog['blog_thumbnail']['original_url'] ?? '') }}" class="img-fluid recent-image" alt="">
                                        </a>
                                        <div class="post-content">
                                            <h5>
                                                <a href="{{ route('blog.slug', ['slug' => $blog['slug']]) }}">{{ @$blog['title'] ?? '' }}</a>
                                            </h5>
                                            <h6>
                                                <i class="ri-calendar-line"></i>
                                                {{ @$blog['created_at'] ? \Carbon\Carbon::parse(@$blog['created_at'])->format('d M, Y') : '' }}
                                            </h6>
                                        </div>
                                    </li>
                                @empty
                                    <li>No Recent Posts</li>
                                @endforelse
                            </ul>
                        </div>

                        {{-- Tags Filter --}}
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
            </div>
        </div>
    </section>
</body>
@endsection
