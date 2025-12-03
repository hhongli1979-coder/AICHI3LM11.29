<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Modules\Taxido\Enums\AmountEnum;
use Illuminate\Support\Facades\Request;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCouponRequest extends FormRequest
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
        $id = $this->route('coupon') ? $this->route('coupon')?->id : $this?->id;
        $coupon = [
            'title' => ['required'],
            'description' => ['required'],
            'code' => ['required', 'min:5', 'max:20', 'unique:coupons,code,' . $id . ',id,deleted_at,NULL'],
            'type' => ['required', 'in:free_shipping,fixed,percentage'],
            'min_ride_fare' => ['nullable', 'numeric', 'min:0'],
            'is_unlimited' => ['required', 'boolean'],
            'usage_per_coupon' => ['nullable', 'numeric'],
            'usage_per_rider' => ['nullable', 'numeric'],
            'status' => ['min:0', 'max:1'],
            'is_expired' => ['min:0', 'max:1'],
            'is_apply_all' => ['min:0', 'max:1'],
        ];

        if (Request::input('type') == AmountEnum::PERCENTAGE) {
            return array_merge($coupon, ['amount' => ['required', 'regex:/^([0-9]{1,2}){1}(\.[0-9]{1,2})?$/']]);
        }

        return $coupon;
    }


    public function messages()
    {
        return [
            'percentage.regex' => 'Enter amount percentage between 0 to 99.99',
            'type.in' => 'Coupon type can be fixed or percentage',
        ];
    }

}
