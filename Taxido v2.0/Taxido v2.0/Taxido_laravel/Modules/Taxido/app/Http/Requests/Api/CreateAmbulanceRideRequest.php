<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class CreateAmbulanceRideRequest extends FormRequest
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
            'locations' => ['required','array'],
            'location_coordinates' => ['required','array'],
            'driver_id' => ['exists:users,id,deleted_at,NULL', 'nullable'],
            'service_id' => ['required','exists:services,id,deleted_at,NULL'],
            'ambulance_id' => ['nullable','exists:ambulances,id,deleted_at,NULL'],
            'select_type' => ['nullable','in:manual,any'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
