<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class CreateDriverRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        $rules = [
            'profile_image_id' => ['required','exists:media,id,deleted_at,NULL'],
            'name' => ['required', 'string', 'max:255', 'unique:users,name'],
            'email' => ['required', Rule::unique('users')->whereNull('deleted_at')],
            'phone' => ['required', 'digits_between:6,15','unique:users,phone,NULL,id,deleted_at,NULL'],
            'status' => ['required'],
            'address.address' => ['required'],
            'address.country_id' => ['required','exists:countries,id'],
            'address.state' => ['required'],
            'address.city' => ['required'],
            'address.postal_code' => ['required'],
            'payment_account.bank_account_no' => ['required'],
            'payment_account.bank_name' => ['required'],
            'payment_account.bank_holder_name' => ['required'],
            'payment_account.swift' => ['required'],
            'payment_account.routing_number' => ['required'],
        ];

        // Only require vehicle fields if service is not ambulance
        if (!$this->isAmbulanceService()) {
            $rules['vehicle_info.vehicle_type_id'] = ['required','exists:vehicle_types,id,deleted_at,NULL'];
            $rules['vehicle_info.model'] = ['required'];
            $rules['vehicle_info.plate_number'] = ['required'];
            $rules['vehicle_info.seat'] = ['required'];
            $rules['vehicle_info.color'] = ['required'];
        }

        return $rules;
    }

    /**
     * Check if the selected service is ambulance
     *
     * @return bool
     */
    protected function isAmbulanceService()
    {
        $ambulanceServiceId = \Modules\Taxido\Models\Service::where('slug', 'ambulance')->value('id');
        return $this->input('service_id') == $ambulanceServiceId;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'notify' => (int) $this->notify,
            'status' => (int) $this->status,
            'phone' => (string) $this->phone,
        ]);
    }

    public function attributes()
    {
        return [
            'address.address' => 'address',
            'address.country_id' => 'country',
            'address.state' => 'state',
            'address.city' => 'city',
            'address.postal_code' => 'postal code',
            // 'vehicle_info.vehicle_type_id' => 'vehicle type',
            'vehicle_info.model' => 'model',
            'vehicle_info.plate_number' => 'plate number',
            'vehicle_info.seat' => 'city',
            'vehicle_info.color' => 'postal code',
            'payment_account.bank_account_no' => 'bank account no',
            'payment_account.bank_name' => 'bank name',
            'payment_account.bank_holder_name' => 'bank holder name',
            'payment_account.swift' => 'swift',
            'payment_account.routing_number' => 'routing_number',
        ];
    }
}
