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
        Schema::create('driver_incentive_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id');
            $table->unsignedBigInteger('vehicle_type_zone_id');
            $table->enum('period_type', ['daily', 'weekly']);
            $table->date('period_date');
            $table->integer('current_rides')->unsigned()->default(0);
            $table->tinyInteger('last_completed_level')->unsigned()->default(0);
            $table->json('completed_levels')->nullable();
            $table->timestamps();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_type_zone_id')->references('id')->on('vehicle_type_zones')->onDelete('cascade');
            $table->unique(['driver_id', 'vehicle_type_zone_id', 'period_type', 'period_date'], 'unique_driver_period_progress');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_incentive_progress');
    }
};
