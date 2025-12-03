<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdatePreferenceRequest extends FormRequest
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
        $id = $this->route('preference') ? $this->route('preference')?->id : $this?->id;
        return [
            'name' => ['string','max:255', UniqueTranslationRule::for('preferences')->whereNull('deleted_at')->ignore($id)],
            'icon_image_id' => ['required', 'exists:media,id,deleted_at,NULL'],
        ];
    }
}
