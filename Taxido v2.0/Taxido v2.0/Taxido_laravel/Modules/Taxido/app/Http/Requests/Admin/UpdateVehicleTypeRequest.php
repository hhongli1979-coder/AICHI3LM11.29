<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateVehicleTypeRequest extends FormRequest
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
        $vehicleType = $this->route('vehicle_type');
        $id = is_object($vehicleType) ? $vehicleType->id : $vehicleType;

        $rules = [
            'name' => [
                'string',
                'max:255',
                UniqueTranslationRule::for('vehicle_types')
                    ->whereNull('deleted_at')
                    ->ignore($id),
            ],
            'services' => ['nullable', 'array'],
            'services.*' => ['exists:services,id,deleted_at,NULL'],
            'serviceCategories' => ['nullable', 'array'],
            'serviceCategories.*' => ['exists:service_categories,id,deleted_at,NULL'],
            'status' => ['required', 'integer', 'min:0', 'max:1'],
            'is_all_zones' => ['nullable', 'boolean'],
        ];

        if (! $this->boolean('is_all_zones')) {
            $rules['zones'] = ['required', 'array', 'min:1'];
        } else {
            $rules['zones'] = ['nullable', 'array'];
        }

        $rules['zones.*'] = ['exists:zones,id,deleted_at,NULL'];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'zones.required' => 'Please select at least one zone',
            'zones.min' => 'Please select at least one zone',
        ];
    }
}
