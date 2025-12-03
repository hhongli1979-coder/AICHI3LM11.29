<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Validation\Rule;
use Modules\Ticket\Enums\InputTypes;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFormFieldRequest extends FormRequest
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
        $id = $this->route('formfield') ? $this->route('formfield')->id : $this->id;
            return [
            'label'  => ['required','string', 'max:255'],
            'name' => ['required', 'string', 'max:255', 'unique:form_fields,name,'.$id.',id,deleted_at,NULL'],
            'placeholder' => [Rule::requiredIf($this->requiresPlaceholder())],
            'type' => ['required'],
            'is_required' => ['required'],
            'status' => ['nullable','required','min:0','max:1'],
        ];
    }

    protected function requiresPlaceholder()
    {
        return in_array($this->type, InputTypes::REQUIRE_PLACEHOLDERS_IN);
    }
}
