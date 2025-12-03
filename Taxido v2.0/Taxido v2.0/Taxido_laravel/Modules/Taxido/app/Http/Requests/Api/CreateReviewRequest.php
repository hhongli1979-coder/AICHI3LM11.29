<?php

namespace Modules\Taxido\Http\Requests\Api;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class CreateReviewRequest extends FormRequest
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
        return [
            'ride_id' => ['required','exists:rides,id,deleted_at,NULL'],
            'rider_id' => ['exists:users,id,deleted_at,NULL'],
            'driver_id' => ['exists:users,id,deleted_at,NULL'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'description' => ['nullable','string'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
