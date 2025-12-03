<?php

namespace App\Imports;

use App\Models\Tag;
use App\Models\Blog;
use App\Models\Category;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BlogImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    private $blogs = [];

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:blogs,slug,NULL,id,deleted_at,NULL'],
            'content' => ['required', 'string'],
            'is_featured' => ['required', 'boolean'],
            'is_sticky' => ['required', 'boolean'],
            'status' => ['required', 'in:0,1'], 
            'blog_thumbnail' => ['nullable', 'url'],
            'blog_meta_image' => ['nullable', 'url'],
            'meta_title' => ['nullable', 'string'],
            'meta_description' => ['nullable', 'string'],
        ];
    }

    public function customValidationMessages()
    {
        return [
            'title.required' => __('validation.title_field_required'),
            'slug.required' => __('validation.slug_field_required'),
            'slug.unique' => __('validation.slug_unique'),
            'content.required' => __('validation.content_field_required'),
            'status.required' => __('validation.status_field_required'),
            'status.in' => __('validation.status_invalid'),
            'blog_thumbnail.url' => __('validation.thumbnail_invalid_url'),
            'blog_meta_image.url' => __('validation.meta_image_invalid_url'),
        ];
    }

    /**
     * @param \Throwable $e
     */
    public function onError(\Throwable $e)
    {
        throw new ExceptionHandler($e->getMessage(), 422);
    }

    public function getImportedBlogs()
    {
        return $this->blogs;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $blog = new Blog([
            'title' => $row['title'],
            'slug' => $row['slug'],
            'content' => $row['content'],
            'is_featured' => $row['is_featured'],
            'is_sticky' => $row['is_sticky'],
            'status' => $row['status'],
            'meta_title' => $row['meta_title'] ?? null,
            'meta_description' => $row['meta_description'] ?? null,
        ]);

        if (isset($row['blog_thumbnail'])) {
            $media = $blog->addMediaFromUrl($row['blog_thumbnail'])->toMediaCollection('blog_thumbnail');
            $media->save();
            $blog->blog_thumbnail_id = $media->id;
        }

        if (isset($row['blog_meta_image'])) {
            $media = $blog->addMediaFromUrl($row['blog_meta_image'])->toMediaCollection('blog_meta_image');
            $media->save();
            $blog->blog_meta_image_id = $media->id;
        }

        $blog->save();

        if (isset($row['categories'])) {
            $categories = Category::whereIn('id', explode(',', $row['categories']))->get();
            $blog->categories()->sync($categories);
        }

        if (isset($row['tags'])) {
            $tags = Tag::whereIn('id', explode(',', $row['tags']))->get();
            $blog->tags()->sync($tags);
        }

        $blog = $blog->fresh();

        $this->blogs[] = [
            'id' => $blog->id,
            'title' => $blog->title,
            'slug' => $blog->slug,
            'content' => $blog->content,
            'status' => $blog->status,
            'is_featured' => $blog->is_featured,
            'is_sticky' => $blog->is_sticky,
            'categories' => $blog->categories->pluck('name')->toArray(),
            'tags' => $blog->tags->pluck('name')->toArray(),
            'blog_thumbnail' => $blog->blog_thumbnail_url,
            'blog_meta_image' => $blog->blog_meta_image_url,
        ];

        return $blog;
    }
}
