<?php

namespace App\Imports;

use App\Models\Page;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PageImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    private $pages = [];

    public function rules(): array
    {

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug,NULL,id,deleted_at,NULL'],
            'content' => ['required', 'string'],
            'status' => ['required', 'in:0,1'],
            'meta_title' => ['nullable', 'string'],
            'meta_description' => ['nullable', 'string'],
            'page_meta_image' => ['nullable', 'url'],
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
            'page_meta_image.url' => __('validation.meta_image_invalid_url'),
        ];
    }

    /**
     * @param \Throwable $e
     */
    public function onError(\Throwable $e)
    {
        throw new ExceptionHandler($e->getMessage(), 422);
    }

    public function getImportedPages()
    {
        return $this->pages;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $page = new Page([
            'title' => $row['title'],
            'slug' => $row['slug'],
            'content' => $row['content'],
            'status' => $row['status'],
            'meta_title' => $row['meta_title'] ?? null,
            'meta_description' => $row['meta_description'] ?? null,
        ]);

        if (isset($row['page_meta_image'])) {
            $media = $page->addMediaFromUrl($row['page_meta_image'])->toMediaCollection('page_meta_image');
            $media->save();
            $page->page_meta_image_id = $media->id;
        }

        $page->save();

        $page = $page->fresh();

        $this->pages[] = [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'content' => $page->content,
            'status' => $page->status,
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
            'meta_image' => $page->meta_image ? $page->meta_image->getUrl() : null,
        ];

        return $page;
    }
}
