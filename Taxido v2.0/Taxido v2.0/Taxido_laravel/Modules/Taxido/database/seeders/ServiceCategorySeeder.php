<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Enums\ServicesEnum;
use Modules\Taxido\Models\ServiceCategory;
use Modules\Taxido\Enums\ServiceCategoryEnum;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $serviceCategories = [
            [
                'name' => ucfirst(ServiceCategoryEnum::RIDE),
                'slug' => 'ride',
                'service' => ServicesEnum::CAB,
                'type' => ServiceCategoryEnum::RIDE,
                'description' => __('taxido::static.service_categories.intercity_desc'),
                'service_category_image_id' => getAttachmentId('ride-cab.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::INTERCITY),
                'slug' => 'intercity',
                'service' => ServicesEnum::CAB,
                'type' => ServiceCategoryEnum::INTERCITY,
                'description' => __('taxido::static.service_categories.intracity_dec'),
                'service_category_image_id' => getAttachmentId('intercity-cab.png'),
            ],
            [
                'name' =>  ucfirst(ServiceCategoryEnum::PACKAGE),
                'slug' => 'package',
                'service' => ServicesEnum::CAB,
                'type' => ServiceCategoryEnum::PACKAGE,
                'description' => __('taxido::static.service_categories.package_dec'),
                'service_category_image_id' => getAttachmentId('package-cab.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::SCHEDULE),
                'slug' => 'schedule',
                'service' => ServicesEnum::CAB,
                'type' => ServiceCategoryEnum::SCHEDULE,
                'description' => __('taxido::static.service_categories.scheduled_dec'),
                'service_category_image_id' => getAttachmentId('schedule-cab.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::RENTAL),
                'slug' => 'rental',
                'service' => ServicesEnum::CAB,
                'type' => ServiceCategoryEnum::RENTAL,
                'description' => __('taxido::static.service_categories.rental_desc'),
                'service_category_image_id' => getAttachmentId('rental-cab.png'),
            ],

            [
                'name' => ucfirst(ServiceCategoryEnum::RIDE),
                'slug' => 'ride-parcel',
                'service' => ServicesEnum::PARCEL,
                'type' => ServiceCategoryEnum::RIDE,
                'description' => __('taxido::static.service_categories.intercity_desc'),
                'service_category_image_id' => getAttachmentId('ride-parcel.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::INTERCITY),
                'slug' => 'intercity-parcel',
                'service' => ServicesEnum::PARCEL,
                'type' => ServiceCategoryEnum::INTERCITY,
                'description' => __('taxido::static.service_categories.intracity_dec'),
                'service_category_image_id' => getAttachmentId('intercity-parcel.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::SCHEDULE),
                'slug' => 'schedule-parcel',
                'service' => ServicesEnum::PARCEL,
                'type' => ServiceCategoryEnum::SCHEDULE,
                'description' => __('taxido::static.service_categories.scheduled_dec'),
                'service_category_image_id' => getAttachmentId('schedule-parcel.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::RIDE),
                'slug' => 'ride-freight',
                'service' => ServicesEnum::FREIGHT,
                'type' => ServiceCategoryEnum::RIDE,
                'description' => __('taxido::static.service_categories.intercity_desc'),
                'service_category_image_id' => getAttachmentId('ride-freight.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::INTERCITY),
                'slug' => 'intercity-freight',
                'service' => ServicesEnum::FREIGHT,
                'type' => ServiceCategoryEnum::INTERCITY,
                'description' => __('taxido::static.service_categories.intracity_dec'),
                'service_category_image_id' => getAttachmentId('intercity-freight.png'),
            ],
            [
                'name' => ucfirst(ServiceCategoryEnum::SCHEDULE),
                'slug' => 'schedule-freight',
                'service' => ServicesEnum::FREIGHT,
                'type' => ServiceCategoryEnum::SCHEDULE,
                'description' => __('taxido::static.service_categories.scheduled_dec'),
                'service_category_image_id' => getAttachmentId('schedule-freight.png'),
            ],

        ];

        foreach ($serviceCategories as $value) {
            $category = ServiceCategory::where('name', $value['name'])->first();
            $serviceId = getServiceIdBySlug($value['service']);
            if (!$category) {
                $category = ServiceCategory::create([
                    'name' => $value['name'],
                    'slug' => $value['slug'],
                    'description' => $value['description'],
                    'type' => $value['type'],
                    'service_id' => $serviceId,
                    'service_category_image_id' => $value['service_category_image_id'],
                ]);
            }
        }
    }
}

