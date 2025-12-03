<?php

namespace Modules\Taxido\Http\Requests\Admin;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;

class CreateWithdrawRequest extends FormRequest
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
    public function rules()
    {
        $roleName = getCurrentRoleName();
        
        $withdrawRequest = [
            'payment_type' => ['nullable', 'required', 'in:paypal,bank'],
            'message' => ['required', 'string', 'min:1'],
            'amount' => ['required', 'numeric', 'nullable'],
        ];

        if ($roleName == EnumsRoleEnum::DRIVER || $roleName == RoleEnum::USER) {
            return array_merge($withdrawRequest, ['driver_id' => ['exists:users,id,deleted_at,NULL']]);
        }

        return $withdrawRequest;
    }

    public function messages()
    {
        return [
            'payment_type.in' => 'Payment type should be paypal or bank',
        ];
    }

}