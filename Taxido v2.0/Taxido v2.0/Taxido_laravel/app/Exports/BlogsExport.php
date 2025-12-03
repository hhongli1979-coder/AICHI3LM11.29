<?php

namespace App\Exports;

use App\Models\Blog;
use App\Tables\BlogTable;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class BlogsExport implements FromCollection,WithMapping,WithHeadings
{
    /**
     * Return a collection of blogs for export.
     *
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $blogTable = new BlogTable(request()->merge([
            'export' => true,
        ]));

        return $blogTable->getData();
    }

    /**
     * Specify the columns for the export.
     *
     * @return array
     */
    public function columns(): array
    {
        return [
            'id',
            'title',
            'slug',
            'content',
            'blog_thumbnail_id',
            'is_featured',
            'is_sticky',
            'categories',
            'tags',
            'status',
        ];
    }

    /**
     * Map the blog data for export.
     *
     * @param Blog $blog
     * @return array
     */
    public function map($blog): array
    {
        return [
            $blog->id,
            $blog->title,
            $blog->slug,
            $blog->content,
            $blog->blog_thumbnail?->original_url,
            $blog->is_featured,
            $blog->is_sticky,
            $blog->categories->pluck('name')->implode(','),
            $blog->tags->pluck('name')->implode(','),
            $blog->status,
        ];
    }

    /**
     * Get the headings for the export file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Title',
            'Slug',
            'Content',
            'Blog Thumbnail Id',
            'Is Featured',
            'Is Sticky',
            'Categories',
            'Tags',
            'Status',
        ];
    }

}
