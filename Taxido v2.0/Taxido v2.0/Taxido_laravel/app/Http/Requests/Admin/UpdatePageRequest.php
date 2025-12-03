<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdatePageRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        $id = $this->route('page') ? $this->route('page')->id : $this->id;
        return [
            'title' => ['string', 'max:255', UniqueTranslationRule::for('pages')->whereNull('deleted_at')->ignore($id)],
            'slug'  => ['nullable', 'max:255', 'unique:pages,slug,'.$id.',id,deleted_at,NULL'],
            'content' => ['nullable','string'],
            'meta_title' => ['nullable','string'],
            'meta_description' => ['nullable','string'],
            'page_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'status' => ['min:0','max:1'],
        ];
    }
}
