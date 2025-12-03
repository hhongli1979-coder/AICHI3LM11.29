<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateTaxRequest extends FormRequest
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
        $id = $this->route('tax') ? $this->route('tax')->id : $this->id;
        return [
            'name' => ['string', 'max:255', UniqueTranslationRule::for('taxes')->whereNull('deleted_at')->ignore($id)],

        ];
    }
}
