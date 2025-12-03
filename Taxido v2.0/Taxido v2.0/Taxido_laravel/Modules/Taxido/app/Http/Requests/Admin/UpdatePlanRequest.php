<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdatePlanRequest extends FormRequest
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
        $id = $this->route('plan') ? $this->route('plan')?->id : $this?->id;
        return [
            'name' => ['string', 'max:255', UniqueTranslationRule::for('plans')->whereNull('deleted_at')->ignore($id)],
            'price' => ['required', 'numeric', 'min:0'],
            'duration' => ['required', 'min:1'],
            'description' => ['nullable'],
        ];
    }
}
