<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateRiderRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,NULL,id,deleted_at,NULL'],
            'phone' => ['required', 'digits_between:6,15','unique:users,phone,NULL,id,deleted_at,NULL'],
            'password' => ['required', 'min:8'],
            'confirm_password' => ['required', 'same:password'],
            'status' => ['required'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'notify' => (int) $this->notify,
            'status' => (int) $this->status,
            'phone' => (string) $this->phone,
        ]);
    }

}
