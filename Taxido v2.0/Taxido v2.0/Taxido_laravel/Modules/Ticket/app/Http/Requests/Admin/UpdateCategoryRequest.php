<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

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
            'name'  => ['max:255','unique:knowledge_base_categories,name,'.$id.',id,deleted_at,NULL'],
            'slug'  => ['nullable', 'max:255', 'unique:knowledge_base_categories,slug,'.$id.',id,deleted_at,NULL'],
            'description' => ['nullable','string'],
            'parent_id' => ['nullable','exists:knowledge_base_categories,id,deleted_at,NULL'],
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
