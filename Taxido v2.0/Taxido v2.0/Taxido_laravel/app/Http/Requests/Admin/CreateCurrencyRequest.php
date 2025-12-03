<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateCurrencyRequest extends FormRequest
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
        return [
            'code'  => ['required', 'string'],
            'symbol' => ['string'],
            'no_of_decimal' => ['required','min:0'],
            'exchange_rate' => ['required','min:0'],
            'status' => ['min:0', 'max:1'],
        ];
    }
}
