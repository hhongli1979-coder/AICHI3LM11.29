<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateSOSRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
            'title' => ['string', 'max:255', UniqueTranslationRule::for('sos')->whereNull('deleted_at')],
            'phone' => ['required', 'digits_between:6,15','unique:sos,phone,NULL,id,deleted_at,NULL'],
            'sos_image_id' => ['nullable', 'exists:media,id,deleted_at,NULL'],
            'status' => ['required', 'min:0', 'max:1'],
        ];
    }
}
