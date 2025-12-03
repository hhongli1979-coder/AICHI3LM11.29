<?php

namespace Modules\Taxido\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDriverDocumentRequest extends FormRequest
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
        $id = $this->route('driver_document') ? $this->route('driver_document')?->id : $this?->id;
        return [
            'document_image_id' => ['required', 'exists:media,id,deleted_at,NULL'],
        ];
    }
}
