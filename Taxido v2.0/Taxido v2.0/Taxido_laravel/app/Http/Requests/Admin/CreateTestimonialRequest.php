<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;


class CreateTestimonialRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'title'  => ['required', 'string', 'max:255', UniqueTranslationRule::for('testimonials')->whereNull('deleted_at')],
            'description' => ['required'],
            'rating' => ['required','min:1','max:5'],
            'profile_image_id' => ['required','exists:media,id,deleted_at,NULL'],
        ];
    }
}
