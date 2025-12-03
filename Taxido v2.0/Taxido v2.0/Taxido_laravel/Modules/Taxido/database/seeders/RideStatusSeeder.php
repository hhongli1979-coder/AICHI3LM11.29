<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Models\RideStatus;
use Modules\Taxido\Enums\RideStatusEnum;

class RideStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rideStatus = [
            [
                'name' => ucfirst(RideStatusEnum::REQUESTED) ,
                'system_reserve' => 1,
                'sequence' => '1'
            ],
            [
                'name' => ucfirst(RideStatusEnum::SCHEDULED) ,
                'system_reserve' => 1,
                'sequence' => '2'
            ],
            [
                'name' => ucfirst(RideStatusEnum::ACCEPTED) ,
                'system_reserve' => 1,
                'sequence' => '3'
            ],
            [
                'name' => ucfirst(RideStatusEnum::REJECTED) ,
                'system_reserve' => 1,
                'sequence' => '4'
            ],
            [
                'name' => ucfirst(RideStatusEnum::ARRIVED) ,
                'system_reserve' => 1,
                'sequence' => '5'
            ],
            [
                'name' => ucfirst(RideStatusEnum::STARTED) ,
                'system_reserve' => 1,
                'sequence' => '6'
            ],
            [
                'name' => ucfirst(RideStatusEnum::CANCELLED) ,
                'system_reserve' => 1,
                'sequence' => '7'
            ],
            [
                'name' => ucfirst(RideStatusEnum::COMPLETED) ,
                'system_reserve' => 1,
                'sequence' => '8'
            ],
        ];

        foreach ($rideStatus as $status) {
            if (!RideStatus::where('name', $status['name'])->first()) {
                RideStatus::create([
                    'name' => $status['name'],
                    'system_reserve' => $status['system_reserve'],
                    'sequence' => $status['sequence']
                ]);
            }
        }
    }
}
