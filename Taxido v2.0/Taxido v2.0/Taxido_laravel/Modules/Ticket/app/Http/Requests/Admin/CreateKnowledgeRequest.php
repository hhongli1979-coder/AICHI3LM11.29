<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateKnowledgeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title'  => ['required', 'string', 'max:255', UniqueTranslationRule::for('knowledge_bases')->whereNull('deleted_at')],
            'slug'  => ['required', 'nullable', 'max:255', 'unique:knowledge_bases,slug,NULL,id,deleted_at,NULL'],
            'content' => ['required', 'min:10'],
            'description' => ['nullable', 'min:10'],
            'categories' => ['nullable','required', 'exists:knowledge_base_categories,id,deleted_at,NULL'],
            'knowledge_thumbnail_id' => ['required','exists:media,id,deleted_at,NULL'],
            'knowledge_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'status' => ['nullable','required','min:0','max:1'],
        ];
    }


}
