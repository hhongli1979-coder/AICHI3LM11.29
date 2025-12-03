<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateDepartmentRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', UniqueTranslationRule::for('departments')->whereNull('deleted_at')],
            'status' => ['nullable', 'required', 'min:0', 'max:1'],
            'image' => ['image', 'mimes:png,jpg'],
            'user_ids.*' => ['nullable', 'exists:users,id,deleted_at,NULL'],
        ];
    }
}
