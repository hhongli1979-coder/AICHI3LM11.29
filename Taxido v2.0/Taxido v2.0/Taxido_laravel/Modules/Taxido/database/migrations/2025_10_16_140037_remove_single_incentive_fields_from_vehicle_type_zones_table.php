<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicle_type_zones', function (Blueprint $table) {
            $table->dropColumn([
                'is_allow_incentive',
                'incentive_period',
                'incentive_target_rides',
                'incentive_amount'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_type_zones', function (Blueprint $table) {
            $table->integer('is_allow_incentive')->default(0)->nullable();
            $table->enum('incentive_period', ['daily', 'weekly'])->nullable();
            $table->integer('incentive_target_rides')->default(0)->nullable();
            $table->double('incentive_amount')->default(0)->nullable();
        });
    }
};
