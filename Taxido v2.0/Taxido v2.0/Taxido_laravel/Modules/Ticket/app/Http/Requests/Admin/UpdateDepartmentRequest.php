<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateDepartmentRequest extends FormRequest
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
        $id = $this->route('department') ? $this->route('department')->id : $this->id;

            return [
            'name' => ['string', 'max:255', UniqueTranslationRule::for('departments')->whereNull('deleted_at')->ignore($id)],
            'description' => ['nullable', 'min:10'],
            'status' => ['nullable','required','min:0','max:1'],
            'image' => ['image','mimes:png,jpg']
        ];
    }
}
