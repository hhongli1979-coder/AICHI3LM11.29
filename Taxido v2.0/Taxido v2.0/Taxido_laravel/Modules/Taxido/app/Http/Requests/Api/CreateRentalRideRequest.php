<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class CreateRentalRideRequest extends FormRequest
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
            'rider_id' => ['exists:users,id,deleted_at,NULL', 'nullable'],
            'service_id' => ['required','exists:services,id,deleted_at,NULL'],
            'service_category_id' => ['required','exists:service_categories,id,deleted_at,NULL'],
            'vehicle_type_id' => ['required','exists:vehicle_types,id,deleted_at,NULL'],
            'coupon' => ['nullable','exists:coupons,code,deleted_at,NULL'],
            'location_coordinates' => ['required'],
            'cargo_image_id' => ['nullable'],
            'description' => ['nullable'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
