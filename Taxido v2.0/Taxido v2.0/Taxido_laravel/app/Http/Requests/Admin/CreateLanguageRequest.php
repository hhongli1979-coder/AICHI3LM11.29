<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateLanguageRequest extends FormRequest
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
            'name'  => ['required', 'string', 'max:255', 'unique:languages,name,NULL,id,deleted_at,NULL'],
            'flag' => ['nullable','string', 'required'],
            'locale' => ['required','unique:languages,locale,NULL,id,deleted_at,NULL'],
            'app_locale' => ['required','unique:languages,app_locale,NULL,id,deleted_at,NULL'],
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
