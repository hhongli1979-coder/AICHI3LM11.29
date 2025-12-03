<?php

namespace App\Exports;

use App\Models\Page;
use App\Exceptions\ExceptionHandler;
use App\Tables\PageTable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class PagesExport implements FromCollection,WithMapping,WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $pageTable = new PageTable(request()->merge([
            'export' => true,
        ]));

        return $pageTable->getData();
    }

    public function columns(): array
    {
        return [
            'id',
            'title',
            'slug',
            'meta_title',
            'meta_description',
            'content',
            'page_meta_image_id',
            'status',
        ];
    }

    public function map($page): array
    {
        return [
            $page->id,
            $page->title,
            $page->slug,
            $page->meta_title,
            $page->meta_description,
            $page->content,
            $page->meta_image?->original_url,
            $page->status,
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
            'Meta Title',
            'Meta Description',
            'Content',
            'Meta Image',
            'Status',
        ];
    }

    public function filter($pages, $request)
    {
        return $pages->get();
    }



}
