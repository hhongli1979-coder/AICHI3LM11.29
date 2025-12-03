<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;
use Illuminate\Validation\Rule;

class UpdateSOSRequest extends FormRequest
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
    public function rules()
    {

        $id = $this->route('sos') ? $this->route('sos')->id : $this->id;

        return [
            'title' => ['string','max:255',UniqueTranslationRule::for('sos')->whereNull('deleted_at')->ignore($id)],
            'phone' => ['required', 'digits_between:6,15',
                Rule::unique('sos', 'phone')
                    ->ignore($this->id)
                    ->whereNull('deleted_at')],
            'sos_image_id' => ['nullable', 'exists:media,id,deleted_at,NULL'],
        ];
    }
}
