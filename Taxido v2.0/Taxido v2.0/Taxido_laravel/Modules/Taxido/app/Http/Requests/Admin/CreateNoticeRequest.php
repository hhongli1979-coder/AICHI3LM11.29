<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateNoticeRequest extends FormRequest
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
            'send_to' => ['required', 'in:all,particular'],
            'color' => ['required'],
            'drivers' => ['nullable', 'array', 'exists:users,id,deleted_at,NULL'],
            'message' => ['required', 'string'],
            'status' => ['required', 'boolean'],
        ];
    }
}
