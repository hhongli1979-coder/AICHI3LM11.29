<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdatePriorityRequest extends FormRequest
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
        $id = $this->route('priority') ? $this->route('priority')?->id : $this?->id;
        return [
            'name' => ['string', 'max:255', UniqueTranslationRule::for('priorities')->whereNull('deleted_at')->ignore($id)],
            'color' => ['required'],
            'response_in' => ['required'],
            'status' => ['nullable','required','min:0','max:1'],
        ];
    }
}
