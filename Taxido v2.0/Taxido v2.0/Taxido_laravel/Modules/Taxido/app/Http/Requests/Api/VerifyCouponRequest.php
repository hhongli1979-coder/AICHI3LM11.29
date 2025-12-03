<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class VerifyCouponRequest extends FormRequest
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
        $coupon = [
            'ride_id' => ['nullable','exists:rides,id,deleted_at,NULL'],
            'coupon' => ['required','exists:coupons,code,deleted_at,NULL'],
        ];

        if(!$this->ride_id) {
            return array_merge($coupon, [
                'locations' => ['required', 'array'],
                'service_id' =>  ['required','exists:services,id,deleted_at,NULL'],
                'vehicle_type_id' =>  ['required','exists:vehicle_types,id,deleted_at,NULL'],
            ]);
        }

        return $coupon;
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()?->first(), 422);
    }
}
