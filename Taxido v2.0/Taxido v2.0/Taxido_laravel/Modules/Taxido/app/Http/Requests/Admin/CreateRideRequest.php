<?php

namespace Modules\Taxido\Http\Requests\Admin;


use Illuminate\Foundation\Http\FormRequest;


class CreateRideRequest extends FormRequest
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
            'coupon' => ['nullable','exists:coupons,code,deleted_at,NULL'],
            'location_coordinates' => ['required'],
            'cargo_image_id' => ['nullable'],
            'description' => ['nullable'],
        ];
    }
}
