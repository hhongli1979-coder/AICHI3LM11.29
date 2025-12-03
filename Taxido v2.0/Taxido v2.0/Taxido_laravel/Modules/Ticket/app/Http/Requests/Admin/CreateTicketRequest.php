<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
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
            'subject' => ['required'],
            'description' => ['required'],
            'department_id' => ['required'],
            'priority_id' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'department_id' => 'Please select department',
            'priority_id' => 'Please select Priority',
        ];
    }
}
