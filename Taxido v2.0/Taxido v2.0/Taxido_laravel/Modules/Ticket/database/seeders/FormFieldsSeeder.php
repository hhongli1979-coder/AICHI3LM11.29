<?php

namespace Modules\Ticket\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Ticket\Models\FormField;

class FormFieldsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $input_fields = [
            [
                'label' => 'Name',
                'name' => 'name',
                'type' => 'text',
                'placeholder' => 'Enter Name', 
                'is_required' => 1,
                'select_type' => null,
                'options' => null,
                'status' => 1,
                'system_reserve' => 1 
            ],
            [
                'label' => 'Email',
                'name' => 'email',
                'type' => 'email',
                'placeholder' => 'Enter Email', 
                'is_required' => 1,
                'select_type' => null,
                'options' => null,
                'status' => 1,
                'system_reserve' => 1 
            ],
            [
                'label' => 'Subject',
                'name' => 'subject',
                'type' => 'text',
                'placeholder' => 'Enter Subject', 
                'is_required' => 1,
                'select_type' => null,
                'options' => null,
                'status' => 1,
                'system_reserve' => 1 
            ],
            [
                'label' => 'Description',
                'name' => 'description',
                'type' => 'textarea',
                'placeholder' => 'Enter Description', 
                'is_required' => 1,
                'select_type' => null,
                'options' => null,
                'status' => 1,
                'system_reserve' => 1 
            ],
        ];

        foreach ($input_fields as $value) {
            FormField::updateOrCreate($value);
        }
    }
}
