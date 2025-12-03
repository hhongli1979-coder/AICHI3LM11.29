<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateDriverRuleRequest extends FormRequest
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
        $id = $this->route('driverRule') ? $this->route('driverRule')?->id : $this?->id;
        return [
            'title' => ['string', 'max:255', UniqueTranslationRule::for('driver_rules')->whereNull('deleted_at')->ignore($id)],
            'rule_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
        ];
    }
}
