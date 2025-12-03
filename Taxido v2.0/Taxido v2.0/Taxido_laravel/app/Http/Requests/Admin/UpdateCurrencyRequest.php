<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCurrencyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
        $id = $this->route('currency') ? $this->route('currency')->id : $this->id;
        return [
            'code'  => ['required', 'string',  'unique:currencies,code,' . $id . ',id,deleted_at,NULL'],
            'symbol' => ['required', 'string'],
            'no_of_decimal' => ['nullable', 'min:0'],
            'exchange_rate' => ['nullable', 'min:0'],
            'status' => ['required', 'min:0', 'max:1'],
        ];
    }
}
