<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateStatusRequest extends FormRequest
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
        $id = $this->route('status') ? $this->route('status')?->id : $this?->id;
            return [
            'name' => ['string', 'max:255', UniqueTranslationRule::for('statuses')->whereNull('deleted_at')->ignore($id)],
            'color' => ['required'],
            'status' => ['nullable','required','min:0','max:1'],
        ];
    }
}
