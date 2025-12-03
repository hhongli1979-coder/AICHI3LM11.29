<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Models\Service;
use Modules\Taxido\Enums\ServicesEnum;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        $services = [
            [
                'name' => ucfirst(ServicesEnum::CAB),
                'type' => 'cab',
                'description' => 'Quick and reliable ride service.',
                'service_icon_id' => getAttachmentId('cab1.png'),
                'service_image_id' => getAttachmentId('cab.png'),
                'is_primary' => true,
            ],
            [
                'name' => ucfirst(ServicesEnum::PARCEL),
                'type' => ServicesEnum::PARCEL,
                'description' => 'Secure and fast deliveries.',
                'service_icon_id' => getAttachmentId('parcel.svg'),
                'service_image_id' => getAttachmentId('parcel.png'),
                'is_primary' => false,
            ],
            [
                'name' => ucfirst(ServicesEnum::FREIGHT),
                'type' => ServicesEnum::FREIGHT,
                'description' => 'Efficient and reliable goods transport.',
                'service_icon_id' => getAttachmentId('freight-icon.svg'),
                'service_image_id' => getAttachmentId('freight.png'),
                'is_primary' => false,
            ],
            [
                'name' => ucfirst(ServicesEnum::AMBULANCE),
                'type' => ServicesEnum::AMBULANCE,
                'description' => 'Emergency medical transport.',
                'service_icon_id' => getAttachmentId('ambulance.png'),
                'service_image_id' => getAttachmentId('ambulance.png'),
                'is_primary' => false,
            ],
        ];

        foreach ($services as $value) {
            if (!Service::where('name', $value['name'])->first()) {
                Service::create([
                    'name' => $value['name'],
                    'type' => $value['type'],
                    'description' => $value['description'],
                    'service_icon_id' =>  $value['service_icon_id'],
                    'service_image_id' =>  $value['service_image_id'],
                    'is_primary' =>  $value['is_primary'],
                ]);
            }
        }
    }
}
