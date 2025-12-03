<?php

namespace Modules\Ticket\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTagRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $id = $this->route('tag') ? $this->route('tag')->id : $this->id;
        return [
            'name'  => ['required', 'string', 'max:255', "name,{$id},id,deleted_at,NULL"],
        ];
    }
}
