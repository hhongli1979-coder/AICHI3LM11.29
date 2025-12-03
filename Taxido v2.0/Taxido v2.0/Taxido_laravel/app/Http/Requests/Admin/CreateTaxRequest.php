<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;


class CreateTaxRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'  => ['required', 'string', 'max:255', UniqueTranslationRule::for('taxes')->whereNull('deleted_at')],
            'rate' => ['required', 'regex:/^([0-9]{1,2}){1}(\.[0-9]{1,2})?$/'],
            'status' => ['required','min:0','max:1'],
        ];
    }
}
