<?php

namespace Modules\Ticket\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Ticket\Models\Status;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $status = [
            [
                'name' => 'Open',
                'color' => 'primary',
                'system_reserve' => 1,
            ],
            [
                'name' => 'Pending',
                'color' => 'secondary',
                'system_reserve' => 1
            ],
            [
                'name' => 'Processing',
                'color' => 'dark',
                'system_reserve' => 1
            ],
            [
                'name' => 'Solved',
                'color' => 'info',
                'system_reserve' => 1
            ],
            [
                'name' => 'Hold',
                'color' => 'warning',
                'system_reserve' => 1
            ],
            [
                'name' => 'Closed',
                'color' => 'danger',
                'system_reserve' => 1
            ],
        ];

        foreach ($status as $value) {
            $status = Status::updateOrCreate($value);
        }
    }
}
