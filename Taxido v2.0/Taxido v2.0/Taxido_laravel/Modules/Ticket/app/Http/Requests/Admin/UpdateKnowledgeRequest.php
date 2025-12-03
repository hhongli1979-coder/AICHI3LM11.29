<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateKnowledgeRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        $id = $this->route('knowledge') ? $this->route('knowledge')->id : $this->id;
        return [
            'title' => ['nullable', 'max:255', UniqueTranslationRule::for('knowledge_bases')->whereNull('deleted_at')->ignore($id)],
            'slug'  => ['nullable', 'max:255', 'unique:knowledge_bases,slug,'.$id.',id,deleted_at,NULL'],
            'description' => ['nullable', 'min:10'],
            'categories' => ['nullable','exists:knowledge_base_categories,id,deleted_at,NULL'],
            'content' => ['required', 'string'],
            'knowledge_thumbnail_id' => ['required','exists:media,id,deleted_at,NULL'],
            'knowledge_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
        ];
    }
}
