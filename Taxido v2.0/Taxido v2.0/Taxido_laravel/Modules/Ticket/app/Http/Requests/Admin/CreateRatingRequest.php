<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateRatingRequest extends FormRequest
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
            'rating' => ['required'],
            'ticket_id' => ['required'],
        ];
    }
}
