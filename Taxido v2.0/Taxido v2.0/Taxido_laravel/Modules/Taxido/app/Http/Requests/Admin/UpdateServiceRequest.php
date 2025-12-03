<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
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
        $id = $this->route('service') ? $this->route('service')?->id : $this?->id;
        return [
            'name' => ['string', 'max:255', 'unique:services,name,'.$id.',id,deleted_at,NULL'],
            'service_icon_id' => ['nullable', 'exists:media,id,deleted_at,NULL'],
            'service_image_id' => ['nullable', 'exists:media,id,deleted_at,NULL'],
            'type' => ['required'],
        ];
    }
}
