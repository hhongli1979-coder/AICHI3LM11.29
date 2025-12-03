<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class StartAmbulanceRideRequest extends FormRequest
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
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
