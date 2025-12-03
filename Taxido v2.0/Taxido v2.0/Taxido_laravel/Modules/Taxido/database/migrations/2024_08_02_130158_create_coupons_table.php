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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->longText('description')->nullable();
            $table->string('code')->nullable();
            $table->enum('type', ['fixed','percentage'])->default('fixed')->nullable();
            $table->decimal('amount',15)->default(0)->nullable();
            $table->decimal('min_ride_fare',15)->default(0)->nullable();
            $table->integer('is_unlimited')->default(1)->nullable();
            $table->integer('usage_per_coupon')->default(0)->nullable();
            $table->integer('usage_per_rider')->default(0)->nullable();
            $table->integer('used')->default(0)->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->integer('is_expired')->default(0)->nullable();
            $table->integer('is_apply_all')->default(0)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('coupon_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coupon_id')->unsigned();
            $table->unsignedBigInteger('zone_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade')->nullable();
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
        });
        
        Schema::create('coupon_service', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coupon_id')->unsigned();
            $table->unsignedBigInteger('service_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade')->nullable();
        });

        Schema::create('coupon_vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coupon_id')->unsigned();
            $table->unsignedBigInteger('vehicle_type_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade')->nullable();
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
        });

        Schema::create('coupon_riders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('coupon_id')->unsigned();
            $table->unsignedBigInteger('rider_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('cascade')->nullable();
            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('coupon_zones');
        Schema::dropIfExists('coupon_vehicle_types');
        Schema::dropIfExists('coupon_riders');
    }
};
