<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class CreateRentalVehicleRequest extends FormRequest
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
     */
    public function rules()
    {
        return [
            'vehicle_per_day_price' => ['required'],
            'vehicle_subtype' => ['required'],
            'fuel_type' => ['required'],
            'gear_type' => ['required'],
            'vehicle_speed' => ['required'],
            'mileage' => ['required'],
            'interior' => ['required'],
            'status' => ['required'],
            'vehicle_type_id' => ['required','exists:vehicle_types,id,deleted_at,NULL'],
            'description' => ['nullable'],
            // 'normal_image' => ['required'],
            // 'front_view' => ['required'],
            // 'side_view' => ['required'],
            // 'boot_view' => ['required'],
            // 'interior_image' => ['required'],
            'zone_ids' => ['required','exists:zones,id,deleted_at,NULL'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
