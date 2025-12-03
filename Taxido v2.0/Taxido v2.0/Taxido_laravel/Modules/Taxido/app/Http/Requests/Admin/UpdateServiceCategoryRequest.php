<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateServiceCategoryRequest extends FormRequest
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
        $id = $this->route('service_category');
        if (is_object($id)) {
            $id = $id->id;
        }

        return [
            'name' => [
                'string',
                'max:255',
                UniqueTranslationRule::for('service_categories')
                    ->ignore($id)
                    ->whereNull('deleted_at')
                    ->where('service_id', $this->service_id),
            ],
            'service_category_image_id' => ['nullable', 'exists:media,id,deleted_at,NULL'],
        ];
    }

}
