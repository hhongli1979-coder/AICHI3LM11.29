<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateCategoryRequest extends FormRequest
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
        $id = $this->route('category') ? $this->route('category')?->id : $this?->id;
        if ($id == $this->parent_id) {
            return false;
        }

        return [
            'name' => ['max:255', UniqueTranslationRule::for('categories')->whereNull('deleted_at')->ignore($id)],
            'slug'  => ['nullable', 'max:255', 'unique:categories,slug,'.$id.',id,deleted_at,NULL'],
            'description' => ['nullable','string'],
            'parent_id' => ['nullable','exists:categories,id,deleted_at,NULL'],
            'category_image_id' => ['nullable','exists:media,id'],
            'category_meta_image_id' => ['nullable','exists:media,id'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'status' => (int) $this->status,
        ]);
    }

}
