<?php

namespace App\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class UpdateProfileRequest extends FormRequest
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
        $id = auth('sanctum')->user()->id;
        return [
            'name'  => ['max:255'],
            'email' => ['email', 'unique:users,email,'.$id.',id,deleted_at,NULL'],
            'phone' => ['required', 'digits_between:6,15','unique:users,phone,'.$id.',id,deleted_at,NULL'],
        ];
    }

    public function messages()
    {
        return [
            'address.*.type.in' => 'Address type can be either shipping or billing',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
