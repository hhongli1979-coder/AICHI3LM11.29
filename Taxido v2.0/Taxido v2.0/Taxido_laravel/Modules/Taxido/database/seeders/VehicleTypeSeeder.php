<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Models\VehicleType;
use Modules\Taxido\Enums\ServiceCategoryEnum;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        $values = [
            [
                'name' => 'Bike',                                                 
                'min_per_unit_charge' => 10,
                'max_per_unit_charge' => 11,
                'cancellation_charge' => 20,
                'waiting_time_charge' => 10,
                'services' => [
                    ServicesEnum::CAB
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::RENTAL,
                    ServiceCategoryEnum::INTERCITY,
                    ServiceCategoryEnum::PACKAGE,
                    ServiceCategoryEnum::SCHEDULE
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 20,
                'vehicle_image_id' => getAttachmentId('bike.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-bike.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Auto',
                'min_per_unit_charge' => 20,
                'max_per_unit_charge' => 30,
                'cancellation_charge' => 30,
                'waiting_time_charge' => 20,
                'services' => [
                    ServicesEnum::CAB
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::SCHEDULE
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 30,
                'vehicle_image_id' => getAttachmentId('auto.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-auto.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Car',
                'min_per_unit_charge' => 30,
                'max_per_unit_charge' => 40,
                'cancellation_charge' => 40,
                'waiting_time_charge' => 20,
                'services' => [
                    ServicesEnum::CAB,
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT,
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY,
                    ServiceCategoryEnum::RENTAL,
                    ServiceCategoryEnum::SCHEDULE,
                    ServiceCategoryEnum::PACKAGE
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 40,
                'vehicle_image_id' => getAttachmentId('car.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-car.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Prime Car',
                'min_per_unit_charge' => 50,
                'max_per_unit_charge' => 60,
                'cancellation_charge' => 50,
                'waiting_time_charge' => 30,
                'services' => [
                    ServicesEnum::CAB,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY,
                    ServiceCategoryEnum::RENTAL,
                    ServiceCategoryEnum::SCHEDULE,
                    ServiceCategoryEnum::PACKAGE
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 50,
                'vehicle_image_id' => getAttachmentId('prime.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-primecar.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Van',
                'min_per_unit_charge' => 70,
                'max_per_unit_charge' => 80,
                'cancellation_charge' => 60,
                'waiting_time_charge' => 40,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 60,
                'vehicle_image_id' => getAttachmentId('cargo-van.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-cargovan.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Bolero',
                'min_per_unit_charge' => 80,
                'max_per_unit_charge' => 60,
                'cancellation_charge' => 90,
                'waiting_time_charge' => 40,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 60,
                'vehicle_image_id' => getAttachmentId('bolero.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-bolero.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Chhota-hathi',
                'min_per_unit_charge' => 80,
                'max_per_unit_charge' => 90,
                'cancellation_charge' => 60,
                'waiting_time_charge' => 40,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 60,
                'vehicle_image_id' => getAttachmentId('Chota-hathi.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-chhota-hathi.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Tempo',
                'min_per_unit_charge' => 80,
                'max_per_unit_charge' => 90,
                'cancellation_charge' => 70,
                'waiting_time_charge' => 50,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 70,
                'vehicle_image_id' => getAttachmentId('tempo.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-tempo.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Truck',
                'min_per_unit_charge' => 90,
                'max_per_unit_charge' => 100,
                'cancellation_charge' => 70,
                'waiting_time_charge' => 50,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 70,
                'vehicle_image_id' => getAttachmentId('truck.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-truck.png'),
                'created_by_id' => getAdmin()?->id
            ],
            [
                'name' => 'Big Truck',
                'min_per_unit_charge' => 110,
                'max_per_unit_charge' => 120,
                'cancellation_charge' => 80,
                'waiting_time_charge' => 60,
                'services' => [
                    ServicesEnum::PARCEL,
                    ServicesEnum::FREIGHT
                ],
                'service_categories' => [
                    ServiceCategoryEnum::RIDE,
                    ServiceCategoryEnum::INTERCITY
                ],
                'commission_type' => 'fixed',
                'commission_rate' => 70,
                'vehicle_image_id' => getAttachmentId('big-truck.png'),
                'vehicle_map_icon_id' => getAttachmentId('top-big-truck.png'),
                'created_by_id' => getAdmin()?->id
            ],
        ];

        foreach($values as $value) {
            $serviceIds = getServiceIdsByTypes($value['services']);
            $service_categories = getServiceCategoryIdsBySlugs($value['service_categories']);
            unset($value['services']);
            unset($value['service_categories']);
            $vehicleType = VehicleType::updateOrCreate(['name' => $value['name']], $value);
            $vehicleType->services()->attach($serviceIds);
            $vehicleType->service_categories()->attach($service_categories);
        }
    }
}
