<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class CreateVehicleTypeRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255', UniqueTranslationRule::for('vehicle_types')->whereNull('deleted_at')],
            'vehicle_image_id' => ['required','exists:media,id,deleted_at,NULL'],
            'vehicle_map_icon_id' => ['required','exists:media,id,deleted_at,NULL'],
            'max_seat' => ['required'],
            'zones' => ['nullable','exists:zones,id,deleted_at,NULL'],
            'serviceCategories' => ['required','exists:service_categories,id,deleted_at,NULL'],
            'status' => ['required','min:0','max:1'],
        ];

    }  
    
    public function messages(): array
    {
        return [
            'vehicle_image_id.required' => 'Please select a vehicle image.',
            'vehicle_map_icon_id' => 'Please select a vehicle map icon image.'
        ];
    }
}
