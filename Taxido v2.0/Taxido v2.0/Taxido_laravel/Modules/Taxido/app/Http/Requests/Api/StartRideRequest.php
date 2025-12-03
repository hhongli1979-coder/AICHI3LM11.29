<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class StartRideRequest extends FormRequest
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
            'ride_id' => ['exists:rides,id,deleted_at,NULL','required'],
            'otp' => ['exists:rides,otp,deleted_at,NULL','required'],
            'start_ride_locations' => ['required', 'array'],
             'start_ride_coordinates' => ['required', 'array']
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
