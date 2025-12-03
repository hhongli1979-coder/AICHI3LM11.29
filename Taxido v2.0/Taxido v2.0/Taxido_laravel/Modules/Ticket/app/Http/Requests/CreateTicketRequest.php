<?php

namespace Modules\Ticket\Http\Requests;

use App\Rules\ReCaptcha;
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
            'name' => ['required'],
            'email' => ['required'],
            'subject' => ['required'],
            'description' => ['required'],
            'department_id' => ['required'],
            'priority_id' => ['required'],
            'g-recaptcha-response' => ['nullable', new ReCaptcha],
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
