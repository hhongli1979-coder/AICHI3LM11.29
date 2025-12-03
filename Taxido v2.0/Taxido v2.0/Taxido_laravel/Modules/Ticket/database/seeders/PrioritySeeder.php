<?php

namespace Modules\Ticket\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Ticket\Models\Priority;

class PrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $priorities = [
            [
                'name' => 'High',
                'color' => 'danger',
                'response_in' => '30',
                'response_value_in' => 'minute',
                'resolve_in' => '180',
                'resolve_value_in' => 'minute',
                'status' => 1,
                'system_reserve' => 1
            ],
            [
                'name' => 'Medium',
                'color' => 'secondary',
                'response_in' => '2',
                'response_value_in' => 'hour',
                'resolve_in' => '3',
                'resolve_value_in' => 'hour',
                'status' => 1,
                'system_reserve' => 1
            ],
            [
                'name' => 'Low',
                'color' => 'primary',
                'response_in' => '1',
                'response_value_in' => 'week',
                'resolve_in' => '1',
                'resolve_value_in' => 'week',
                'status' => 1,
                'system_reserve' => 1
            ],
            [
                'name' => 'Urgent',
                'color' => 'danger',
                'response_in' => '15',
                'response_value_in' => 'minute',
                'resolve_in' => '60',
                'resolve_value_in' => 'minute',
                'status' => 1,
                'system_reserve' => 0
            ],
            [
                'name' => 'Critical',
                'color' => 'danger',
                'response_in' => '10',
                'response_value_in' => 'minute',
                'resolve_in' => '30',
                'resolve_value_in' => 'minute',
                'status' => 1,
                'system_reserve' => 0
            ],
            [
                'name' => 'High Priority',
                'color' => 'warning',
                'response_in' => '1',
                'response_value_in' => 'hour',
                'resolve_in' => '2',
                'resolve_value_in' => 'hour',
                'status' => 1,
                'system_reserve' => 0
            ],
            [
                'name' => 'Medium Priority',
                'color' => 'info',
                'response_in' => '3',
                'response_value_in' => 'hour',
                'resolve_in' => '6',
                'resolve_value_in' => 'hour',
                'status' => 1,
                'system_reserve' => 0
            ],
            
        ];

        foreach ($priorities as $value) {
            Priority::updateOrCreate($value);
        }
    }
}
