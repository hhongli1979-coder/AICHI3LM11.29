<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreatePlanRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', UniqueTranslationRule::for('plans')->whereNull('deleted_at')],
            'price' => ['required', 'numeric', 'min:0'],
            'duration' => ['required', 'min:1'],
            'status' => ['required', 'min:0', 'max:1'],
            'description' => ['nullable'],
        ];
    }
}
