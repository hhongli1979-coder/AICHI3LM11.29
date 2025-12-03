<?php

namespace Modules\Taxido\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PreferenceRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $locales = config('app.locales', ['en']);
        $rules = [
            'icon_image' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', 'boolean']
        ];

        foreach ($locales as $locale) {
            $rules["name.$locale"] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
