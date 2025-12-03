<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
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
            'name' => ['required', 'string', 'max:255', UniqueTranslationRule::for('knowledge_base_categories')->whereNull('deleted_at')],
            'slug'  => ['required', 'nullable', 'max:255', 'unique:knowledge_base_categories,slug,NULL,id,deleted_at,NULL'],
            'description' => ['nullable','string'],
            'parent_id' => ['nullable','exists:knowledge_base_categories,id,deleted_at,NULL'],
            'category_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'category_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'status' => ['required','min:0','max:1']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'status' => (int) $this->status,
        ]);
    }
}
