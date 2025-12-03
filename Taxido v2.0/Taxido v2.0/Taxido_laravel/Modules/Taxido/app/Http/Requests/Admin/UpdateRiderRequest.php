<?php

namespace Modules\Taxido\Http\Requests\Admin;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRiderRequest extends FormRequest
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

        $riderId = $this->route('rider') ? $this->route('rider')->id : $this->id;

        return [
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')
                    ->ignore($riderId)
                    ->whereNull('deleted_at'),
            ],
            'phone' => [
                'required',
                'digits_between:6,15',
                Rule::unique('users', 'phone')
                    ->ignore($riderId)
                    ->whereNull('deleted_at'),
            ],
        ];

    }

    protected function prepareForValidation()
    {
        $this->merge([
            'phone' => (string) $this->phone,
            'status' => (int) $this->status,
        ]);
    }
}
