<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('zones', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->geometry('place_points')->nullable();
            $table->json('locations')->nullable();
            $table->json('payment_method')->nullable();
            $table->decimal('amount', 15)->default(0)->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->enum('weight_unit', ['kilogram', 'pound'])->default('kilogram')->nullable();
            $table->enum('distance_type', ['mile', 'km'])->default('mile')->nullable();
            $table->unsignedBigInteger('currency_id')->nullable();

            $table->unsignedBigInteger('total_rides_in_peak_zone')->default(0)->nullable();
            $table->decimal('peak_zone_geographic_radius', 8, 2)->default(2.00)->nullable(); // km
            $table->unsignedInteger('minutes_choosing_peak_zone')->default(5)->nullable();
            $table->unsignedInteger('minutes_peak_zone_active')->default(60)->nullable();
            $table->decimal('peak_price_increase_percentage', 5, 2)->default(20.00)->nullable();

            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade')->nullable();
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('cascade')->nullable();
        });

        Schema::create('driver_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id');
            $table->unsignedBigInteger('zone_id');

            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });

        Schema::create('dispatcher_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dispatcher_id');
            $table->unsignedBigInteger('zone_id');

            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
            $table->foreign('dispatcher_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });

        Schema::create('vehicle_type_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_id');
            $table->unsignedBigInteger('zone_id');
            $table->decimal('base_fare_charge', 15)->default(0)->nullable();
            $table->decimal('base_distance', 15)->default(0)->nullable();
            $table->decimal('is_allow_tax', 15)->default(0)->nullable();
            $table->decimal('is_allow_preference', 15)->default(0)->nullable();

            $table->integer('is_allow_incentive')->default(0)->nullable();
            $table->enum('incentive_period', ['daily', 'weekly'])->nullable();
            $table->integer('incentive_target_rides')->default(0)->nullable();
            $table->double('incentive_amount')->default(0)->nullable();

            $table->unsignedBigInteger('tax_id')->nullable();
            $table->decimal('per_distance_charge', 15)->default(0)->nullable();
            $table->decimal('per_minute_charge', 15)->default(0)->nullable();
            $table->decimal('per_weight_charge', 15)->default(0)->nullable();
            $table->integer('is_unlimited')->default(1)->nullable();
            $table->decimal('waiting_charge', 15)->default(0)->nullable();
            $table->decimal('free_waiting_time_before_start_ride', 15)->default(0)->nullable();
            $table->decimal('free_waiting_time_after_start_ride', 15)->default(0)->nullable();
            $table->decimal('is_allow_airport_charge', 15)->default(0)->nullable();
            $table->decimal('cancellation_charge_for_rider', 15)->default(0)->nullable();
            $table->decimal('cancellation_charge_for_driver', 15)->default(0)->nullable();
            $table->enum('charge_goes_to', ['rider', 'driver', 'admin'])->default('admin')->nullable();
            $table->enum('commission_type', ['fixed', 'percentage'])->default('fixed')->nullable();
            $table->decimal('commission_rate', 15)->default(0.0)->nullable();
            $table->decimal('airport_charge_rate', 15)->default(0.0)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
            $table->foreign('tax_id')->references('id')->on('taxes')->onDelete('cascade')->nullable();
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
        });

        Schema::create('peak_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('zone_id')->nullable();
            $table->string('name')->default('Auto-generated Peak Zone')?->nullable();
            $table->geometry('polygon')->nullable();
            $table->json('locations')->nullable();
            $table->integer('is_active')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->double('distance_price_percentage')->default(0);
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade')->nullable();
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zones');
        Schema::dropIfExists('driver_zones');
        Schema::dropIfExists('vehicle_type_zones');
        Schema::dropIfExists('dispatcher_zones');
        Schema::dropIfExists('peak_zones');
    }
};
