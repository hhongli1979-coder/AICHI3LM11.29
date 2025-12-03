<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateStatusRequest extends FormRequest
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
            'name'  => ['required', 'string', 'max:255', UniqueTranslationRule::for('statuses')->whereNull('deleted_at')],
            'color' => ['required'],
            'status' => ['nullable','required','min:0','max:1'],
        ];
    }
}
