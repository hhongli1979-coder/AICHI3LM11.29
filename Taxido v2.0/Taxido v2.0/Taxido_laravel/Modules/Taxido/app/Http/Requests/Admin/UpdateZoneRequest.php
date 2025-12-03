<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateZoneRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $id = $this->route('zone') ? $this->route('zone')?->id : $this?->id;
        return [
            'name' => ['required','string','max:255',UniqueTranslationRule::for('zones')->whereNull('deleted_at')->ignore($id)],
            'place_points' => ['required'],
            'status' => ['min:0','max:1'],
        ];
    }
}



