<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreatePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title'  => ['required', 'string', 'max:255', UniqueTranslationRule::for('pages')->whereNull('deleted_at')],
            'slug'  => ['required', 'nullable', 'max:255', 'unique:pages,slug,NULL,id,deleted_at,NULL'],
            'content' => ['required','string'],
            'meta_title' => ['nullable','string'],
            'meta_description' => ['nullable','string'],
            'page_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'status' => ['min:0','max:1'],
        ];
    }
}
