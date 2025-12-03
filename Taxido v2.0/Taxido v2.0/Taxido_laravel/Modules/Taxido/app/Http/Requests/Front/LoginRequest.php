<?php

namespace Modules\Taxido\Http\Requests\Front;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => ['required','email','exists:users,email,deleted_at,NULL'],
            'password' => 'required',
        ];
    }
}