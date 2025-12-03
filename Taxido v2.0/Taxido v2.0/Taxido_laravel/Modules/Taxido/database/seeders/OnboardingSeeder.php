<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Taxido\Models\Onboarding;

class OnboardingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
    */

    public function run()
    {
        $onboardings = [
            [
                'title' => 'Accept A Job',
                'description' => 'Easily browse and accept job requests in just one tap. Stay in control of your schedule and start earning instantly.',
                'type' => 'driver',
                'onboarding_image_id' => getAttachmentId('driver-screen-1.png'),
            ],
            [
                'title' => 'Earn Money',
                'description' => 'Complete rides or deliveries and earn money seamlessly. Get paid quickly and enjoy financial freedom on your terms.',
                'type' => 'driver',
                'onboarding_image_id' => getAttachmentId('driver-screen-2.png'),
            ],
            [
                'title' => 'Enable Your Location',
                'description' => 'Turn on your location services to receive nearby job requests and provide better service to customers in real-time',
                'type' => 'driver',
                'onboarding_image_id' => getAttachmentId('driver-screen-3.png'),
            ],
            [
                'title' => 'Choose Your Destination',
                'description' => 'Select your preferred route or destination before starting your ride. Plan your trips for a smooth and hassle-free journey.',
                'type' => 'rider',
                'onboarding_image_id' => getAttachmentId('rider-screen-1.png'),
            ],
            [
                'title' => 'Enjoy Your Trip',
                'description' => 'Sit back and enjoy a comfortable ride with our seamless service. Travel with ease and reach your destination worry-free.',
                'type' => 'rider',
                'onboarding_image_id' => getAttachmentId('rider-screen-2.png'),
            ],
            [
                'title' => 'Check Fare & Book Ride',
                'description' => 'Get an estimated fare before confirming your ride. Compare options and book your trip with confidence.',
                'type' => 'rider',
                'onboarding_image_id' => getAttachmentId('rider-screen-3.png'),
            ],
        ];

        foreach ($onboardings as $value) {
            if (!Onboarding::where('title', $value['title'])->first()) {
                Onboarding::create([
                    'title' => $value['title'],
                    'description' => $value['description'],
                    'type' => $value['type'],
                    'onboarding_image_id' =>  $value['onboarding_image_id'],
                ]);
            }
        }
    }
}
