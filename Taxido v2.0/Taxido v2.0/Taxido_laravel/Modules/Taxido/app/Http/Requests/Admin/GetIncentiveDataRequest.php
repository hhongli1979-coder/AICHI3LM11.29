<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GetIncentiveDataRequest extends FormRequest
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
            'vehicle_type_id' => 'required|integer|exists:vehicle_types,id',
            'zone_id' => 'required|integer|exists:zones,id',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vehicle_type_id.required' => 'Vehicle type is required',
            'vehicle_type_id.integer' => 'Vehicle type must be a valid number',
            'vehicle_type_id.exists' => 'Selected vehicle type does not exist',
            'zone_id.required' => 'Zone is required',
            'zone_id.integer' => 'Zone must be a valid number',
            'zone_id.exists' => 'Selected zone does not exist',
        ];
    }
}
