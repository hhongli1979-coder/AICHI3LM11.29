<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLanguageRequest extends FormRequest
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
        $id = $this->route('language') ? $this->route('language')->id : $this->id;
        return [
            'name'  => ['max:255','unique:languages,name,'.$id.',id,deleted_at,NULL'],
            'locale' => ['required','unique:languages,locale,'.$id.',id,deleted_at,NULL'],
            'app_locale' => ['required','unique:languages,app_locale,'.$id.',id,deleted_at,NULL'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'status' => (int) $this->status,
        ]);
    }

}
