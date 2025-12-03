<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use CodeZero\UniqueTranslation\UniqueTranslationRule;

class UpdateBlogRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        $id = $this->route('blog') ? $this->route('blog')->id : $this->id;
        return [
            'title' => ['required', 'max:255', UniqueTranslationRule::for('blogs')->whereNull('deleted_at')->ignore($id)],
            'slug'  => ['required', 'max:255', 'unique:blogs,slug,'.$id.',id,deleted_at,NULL'],
            'description' => ['nullable', 'min:10'],
            'categories' => ['nullable','exists:categories,id,deleted_at,NULL'],
            'content' => ['required', 'string'],
            'blog_thumbnail_id' => ['required','exists:media,id,deleted_at,NULL'],
            'blog_meta_image_id' => ['nullable','exists:media,id,deleted_at,NULL'],
            'tags' => ['required','exists:tags,id,deleted_at,NULL'],
            'is_featured' => ['min:0','max:1'],
            'is_sticky' => ['min:0','max:1'],
        ];
    }
}
