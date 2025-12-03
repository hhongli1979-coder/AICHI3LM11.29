<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Validation\Rule;
use Modules\Taxido\Models\Service;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverRequest extends FormRequest
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
        $driverId = $this->route('driver') ? $this->route('driver')->id : $this->id;
        $rules = [
            'profile_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'name' => ['required','max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
                    ->ignore($driverId)
                    ->whereNull('deleted_at')
            ],
            'phone' => [
                'required',
                'max:255',
                Rule::unique('users')
                    ->ignore($driverId)
                    ->whereNull('deleted_at')
                    ->where(function ($query) {
                        $query->where('country_code', request('country_code'));
                    }),
            ],
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

        if (!$this->isAmbulanceService()) {
            $rules['vehicle_info.vehicle_type_id'] = ['required','exists:vehicle_types,id,deleted_at,NULL'];
            $rules['vehicle_info.model'] = ['required'];
            $rules['vehicle_info.plate_number'] = ['required'];
            $rules['vehicle_info.seat'] = ['required'];
            $rules['vehicle_info.color'] = ['required'];
        }

        return $rules;
    }

    protected function isAmbulanceService()
    {
        $ambulanceServiceId = Service::where('slug', 'ambulance')?->value('id');
        return $this->input('service_id') == $ambulanceServiceId;
    }

}
