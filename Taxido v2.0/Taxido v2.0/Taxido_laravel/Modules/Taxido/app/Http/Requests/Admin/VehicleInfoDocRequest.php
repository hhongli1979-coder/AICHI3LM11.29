<?php

namespace Modules\Taxido\Http\Requests\Admin;

use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class VehicleInfoDocRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        return [
            'vehicle_info_id' => ['exists:vehicle_info,id,deleted_at,NULL', 'required'],
            'document_id' => ['required','exists:documents,id,deleted_at,NULL'],
            'document_image_id' => ['exists:media,id,deleted_at,NULL', 'required'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new ExceptionHandler($validator->errors()->first(), 422);
    }
}
