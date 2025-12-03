<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Models\SOSStatus;
use Modules\Taxido\Enums\SOSStatusEnum;

class SosStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => ucfirst(SOSStatusEnum::REQUESTED),
                'slug' => SOSStatusEnum::REQUESTED,
                'created_by_id' => 1,
            ],
            [
                'name' => ucfirst(SOSStatusEnum::PROCESSING),
                'slug' => SOSStatusEnum::PROCESSING,
                'created_by_id' => 1,
            ],
            [
                'name' => ucfirst(SOSStatusEnum::COMPLETED),
                'slug' => SOSStatusEnum::COMPLETED,
                'created_by_id' => 1,
            ],
        ];

        foreach ($statuses as $status) {
            SOSStatus::firstOrCreate(
                ['slug' => $status['slug']],
                [
                    'name' => $status['name'],
                    'created_by_id' => $status['created_by_id'],
                ]
            );
        }
    }
}
