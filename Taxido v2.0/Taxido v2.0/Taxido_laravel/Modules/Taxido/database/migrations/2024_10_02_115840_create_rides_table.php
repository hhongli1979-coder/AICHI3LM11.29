<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('ride_status', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('color')->nullable();
            $table->integer('sequence')->nullable();
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->integer('status')->default(1);
            $table->integer('system_reserve')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('ride_requests', function (Blueprint $table) {
            $table->id();
            $table->integer('ride_number')->nullable();
            $table->unsignedBigInteger('ambulance_id')->nullable();
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->unsignedBigInteger('service_category_id')->nullable();
            $table->unsignedBigInteger('hourly_package_id')->nullable();
            $table->unsignedBigInteger('cargo_image_id')->nullable();
            $table->json('rider')->nullable();
            $table->string('currency_code')->nullable();
            $table->longText('currency_symbol')->nullable();
            $table->json('locations')->npelable();
            $table->json('location_coordinates')->nullable();
            $table->json('parcel_receiver')->nullable();
            $table->integer('parcel_delivered_otp')->nullable();
            $table->string('distance')->nullable();
            $table->string('distance_unit')->nullable();
            $table->string('weight')->nullable();
            $table->string('payment_method')->nullable();
            $table->double('ride_fare')->nullable();

            // 1.0.5
            $table->string('duration')->nullable();
            $table->double('base_fare_charge')->nullable();
            $table->double('additional_distance_charge')->nullable();
            $table->double('additional_minute_charge')->nullable();
            $table->double('additional_weight_charge')->nullable();
            $table->double('tax')->nullable();
            $table->double('commission')->nullable();
            $table->double('driver_commission')->nullable();
            $table->double('platform_fee')->nullable();

            // 1.0.8
            $table->integer('is_peak_zone')->default(0);
            $table->double('preference_charge')->nullable();
            $table->unsignedBigInteger('peak_zone_id')->nullable();
            $table->double('peak_zone_charge')->nullable();
            $table->double('sub_total')->nullable();
            $table->double('total')->nullable();

            $table->longText('description')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->double('no_of_days')->nullable();
            $table->double('driver_per_day_charge')->nullable();
            $table->double('vehicle_per_day_charge')->nullable();
            $table->double('driver_rent')->nullable();
            $table->double('vehicle_rent')->nullable();
            $table->integer('is_with_driver')->default(0);
            $table->unsignedBigInteger('rental_vehicle_id')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ambulance_id')->references('id')->on('ambulances')->onDelete('cascade');
            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade');
            $table->foreign('rental_vehicle_id')->references('id')->on('rental_vehicles')->onDelete('cascade');
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade');
            $table->foreign('cargo_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('hourly_package_id')->references('id')->on('hourly_packages')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('peak_zone_id')->references('id')->on('peak_zones')->onDelete('cascade');
        });

        Schema::create('ride_request_drivers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_request_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();

            $table->foreign('ride_request_id')->references('id')->on('ride_requests')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('ride_request_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_request_id')->nullable();
            $table->unsignedBigInteger('zone_id')->nullable();

            $table->foreign('ride_request_id')->references('id')->on('ride_requests')->onDelete('cascade');
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade');
        });

        Schema::create('ride_request_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_request_id')->nullable();
            $table->unsignedBigInteger('preference_id')->nullable();

            $table->foreign('preference_id')->references('id')->on('preferences')->onDelete('cascade');
            $table->foreign('ride_request_id')->references('id')->on('ride_requests')->onDelete('cascade');
        });

        Schema::create('rides', function (Blueprint $table) {
            $table->id();
            $table->longText('uuid')->nullable();
            $table->unsignedBigInteger('ambulance_id')->nullable();
            $table->integer('ride_number')->nullable();
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->unsignedBigInteger('ride_status_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('service_category_id')->nullable();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('coupon_id')->nullable();
            $table->unsignedBigInteger('hourly_package_id')->nullable();
            $table->decimal('coupon_total_discount',8,2)->nullable();
            $table->json('rider')->nullable();
            $table->longText('currency_symbol')->nullable();
            $table->string('currency_code')->nullable();
            $table->integer('parcel_delivered_otp')->nullable();
            $table->json('parcel_receiver')->nullable();
            $table->integer('otp')->nullable();
            $table->unsignedBigInteger('cargo_image_id')->nullable();
            $table->integer('is_otp_verified')->default(0)->nullable();
            $table->json('locations')->nullable();
            $table->json('location_coordinates')->nullable();
            $table->string('duration')->nullable();
            $table->string('weight')->nullable();
            $table->string('distance')->nullable();
            $table->string('distance_unit')->nullable();
            $table->string('payment_method')->nullable();
            $table->enum('payment_mode', ['online', 'offline'])->default('online')->nullable();
            $table->string('payment_status')->default('PENDING');
            $table->double('ride_fare')->nullable();
            $table->decimal('driver_tips',8,4)->nullable();
            $table->decimal('tax',8,4)->nullable();
            $table->decimal('platform_fees',8,4)->nullable();
            $table->decimal('zone_charge',8,4)->nullable();
            $table->longText('description')->nullable();
            $table->double('processing_fee')->nullable();
            $table->decimal('wallet_balance',8,4)->nullable();

            $table->double('base_fare_charge')->nullable();
            $table->double('additional_distance_charge')->nullable();
            $table->double('additional_minute_charge')->nullable();
            $table->double('additional_weight_charge')->nullable();
            $table->double('bid_extra_amount')->nullable();

            $table->double('commission')->nullable();
            $table->double('driver_commission')->nullable();
            $table->double('platform_fee')->nullable();
            // 1.0.8
            $table->double('total_extra_charge')->default(0.0);
            $table->integer('is_peak_zone')->default(0);
            $table->unsignedBigInteger('peak_zone_id')->nullable();
            $table->double('peak_zone_charge')->nullable();

            $table->double('sub_total')->nullable();
            $table->double('total')->nullable();

            $table->double('rider_cancellation_charge')->nullable();
            $table->double('driver_cancellation_charge')->nullable();
            $table->double('waiting_charges')->nullable();
            $table->double('waiting_total_times')->nullable();

            $table->longText('comment')->nullable();
            $table->longText('cancellation_reason')->nullable();
            $table->string('invoice_url')->nullable();
            $table->json('start_ride_locations')->nullable();
            $table->json('start_ride_coordinates')->nullable();

            $table->longText('invoice_id')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamp('dropped_at')->nullable();
            $table->timestamp('parcel_otp_verified_at')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->unsignedBigInteger('no_of_days')->nullable();
            $table->double('driver_rent')->nullable();
            $table->double('vehicle_rent')->nullable();
            $table->integer('is_with_driver')->default(0);
            $table->unsignedBigInteger('rental_vehicle_id')->nullable();
            $table->longText('assign_type')->nullable();
            $table->longText('assigned_driver')->nullable();
            $table->decimal('vehicle_per_day_price',8,4)->nullable();
            $table->decimal('driver_per_day_charge',8,4)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ambulance_id')->references('id')->on('ambulances')->onDelete('cascade');
            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('ride_status_id')->references('id')->on('ride_status')->onDelete('cascade');
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade');
            $table->foreign('rental_vehicle_id')->references('id')->on('rental_vehicles')->onDelete('cascade');
            $table->foreign('cargo_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('hourly_package_id')->references('id')->on('hourly_packages')->onDelete('cascade');
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade');
            $table->foreign('peak_zone_id')->references('id')->on('peak_zones')->onDelete('cascade');
        });

        Schema::create('ride_status_activities', function (Blueprint $table) {
            $table->id();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('ride_request_id')->nullable();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->string('changed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('ride_request_id')->references('id')->on('ride_requests')->onDelete('cascade');
        });

        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_request_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->double('amount')->nullable();
            $table->enum('status',['rejected','accepted'])->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('ride_request_id')->references('id')->on('ride_requests')->onDelete('cascade');
        });

        Schema::create('ride_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('zone_id')->nullable();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade');
        });

        Schema::create('ride_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('preference_id')->nullable();

            $table->foreign('preference_id')->references('id')->on('preferences')->onDelete('cascade');
            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
        });

        Schema::create('ride_bids', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('bid_id')->nullable();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('bid_id')->references('id')->on('bids')->onDelete('cascade');
        });

        Schema::create('driver_wallet_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_wallet_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('currency_symbol')->nullable();
            $table->string('currency_code')->nullable();
            $table->decimal('amount',8,2)->default(0.0);
            $table->enum('type',['credit','debit'])->nullable();
            $table->string('detail')->nullable();
            $table->unsignedBigInteger('from_user_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_wallet_id')->references('id')->on('driver_wallets')->onDelete('cascade');
            $table->foreign('from_user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('rider_wallet_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rider_wallet_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->decimal('amount',8,2)->default(0.0);
            $table->enum('type',['credit','debit'])->nullable();
            $table->string('detail')->nullable();
            $table->string('transaction_id')->nullable();
            $table->unsignedBigInteger('from_user_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('rider_wallet_id')->references('id')->on('rider_wallets')->onDelete('cascade');
            $table->foreign('from_user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('fleet_wallet_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fleet_wallet_id')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->decimal('amount', 8, 2)->default(0.0);
            $table->enum('type', ['credit', 'debit'])->nullable();
            $table->string('detail')->nullable();
            $table->string('transaction_id')->nullable();
            $table->unsignedBigInteger('from_user_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fleet_wallet_id')->references('id')->on('fleet_manager_wallets')->onDelete('cascade');
            $table->foreign('from_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
        Schema::dropIfExists('rides');
        Schema::dropIfExists('ride_zones');
        Schema::dropIfExists('ride_status');
        Schema::dropIfExists('ride_requests');
        Schema::dropIfExists('ride_status_activities');
        Schema::dropIfExists('driver_wallet_histories');
        Schema::dropIfExists('rider_wallet_histories');
        Schema::dropIfExists('fleet_wallet_histories');
    }
};
