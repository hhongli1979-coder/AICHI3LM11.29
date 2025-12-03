<?php

namespace Modules\Taxido\Http\Requests\Admin;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;

class UpdateWithdrawRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'payment_type' => ['nullable', 'in:paypal,bank'],
            'status' => ['nullable', 'required', 'in:pending,approved,rejected'],
        ];
    }

    public function messages()
    {
        return [
            'payment_type.in' => 'Payment type should be paypal or bank ',
        ];
    }
    
}