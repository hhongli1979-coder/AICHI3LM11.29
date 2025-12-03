<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateHourlyPackageRequest extends FormRequest
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
            'status' => ['required', 'in:0,1',],
            'hour' => ['required', 'numeric', 'min:0.1'],
            'distance_type' => ['required', 'in:mile,km'],
            'distance' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}