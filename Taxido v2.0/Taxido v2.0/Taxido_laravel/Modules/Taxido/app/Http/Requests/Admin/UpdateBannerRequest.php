<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateBannerRequest extends FormRequest
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
        $id = $this->route('banner') ? $this->route('banner')?->id : $this?->id;
        return [
            'title' => ['string','max:255', UniqueTranslationRule::for('banners')->whereNull('deleted_at')->ignore($id)],
            'banner_image_id' => ['required', 'exists:media,id,deleted_at,NULL'],
        ];
    }
}
