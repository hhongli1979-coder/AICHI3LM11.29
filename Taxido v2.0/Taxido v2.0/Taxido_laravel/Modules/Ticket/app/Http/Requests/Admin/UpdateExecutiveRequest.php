<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExecutiveRequest extends FormRequest
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

        $id = $this->route('executive') ? $this->route('executive')->id : $this->id;
        return [
            'name' => ['required','max:255'],
            'email' => ['required','email', 'unique:users,email,'.$id.',id,deleted_at,NULL'],
            'phone' => ['required','numeric','digits_between:6,15'],
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
