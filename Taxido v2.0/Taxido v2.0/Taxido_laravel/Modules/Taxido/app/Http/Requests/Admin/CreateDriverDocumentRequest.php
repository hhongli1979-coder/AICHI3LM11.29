<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateDriverDocumentRequest extends FormRequest
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
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'driver_id' =>  ['nullable','exists:users,id,deleted_at,NULL'],
            'document_id' =>  ['nullable','exists:documents,id,deleted_at,NULL'],
            'document_image_id' => ['required','exists:media,id,deleted_at,NULL'],
            'status' => ['required','in:pending,approved,rejected'],
        ];
    }
}
