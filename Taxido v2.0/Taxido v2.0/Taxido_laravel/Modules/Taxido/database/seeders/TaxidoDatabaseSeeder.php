<?php

namespace Modules\Taxido\Database\Seeders;

use Illuminate\Database\Seeder;

class TaxidoDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(TaxidoSettingSeeder::class);
        $this->call(DefaultImagesSeeder::class);
        $this->call(RideStatusSeeder::class);
        $this->call(ServiceSeeder::class);
        $this->call(ServiceCategorySeeder::class);
        $this->call(OnboardingSeeder::class);
        $this->call(SosStatusSeeder::class);
    }
}
