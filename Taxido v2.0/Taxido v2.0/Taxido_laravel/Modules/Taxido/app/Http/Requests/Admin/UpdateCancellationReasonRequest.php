<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateCancellationReasonRequest extends FormRequest
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
        $id = $this->route('cancellation_reason') ? $this->route('cancellation_reason')?->id : $this?->id;
        return [
            'title' => ['required','max:255', UniqueTranslationRule::for('cancellation_reasons')->whereNull('deleted_at')->ignore($id)]
        ];
    }
}
