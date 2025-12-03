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
        Schema::create('vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('vehicle_image_id')->nullable();
            $table->unsignedBigInteger('vehicle_map_icon_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->string('slug', 191)->unique()->nullable();
            $table->integer('max_seat')->nullable();
            $table->integer('is_all_zones')->default(0)->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('vehicle_map_icon_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        });

        Schema::create('vehicle_info', function (Blueprint $table) {
            $table->id();
            $table->longText('name')?->nullable();
            $table->longText('description')?->nullable();
            $table->string('plate_number')->nullable();
            $table->string('color')->nullable();
            $table->string('model')->nullable();
            $table->integer('seat')->nullable();
            $table->string('model_year')->nullable();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->integer('is_verified')->nullable();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('vehicle_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_image_id')->nullable();
            $table->unsignedBigInteger('attachment_id')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('vehicle_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('attachment_id')->references('id')->on('media')->onDelete('cascade');
        });

        Schema::create('vehicle_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_id');
            $table->unsignedBigInteger('service_id');

            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade')->nullable();
        });

        Schema::create('fleet_vehicles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade');
        });

        Schema::create('ambulances', function (Blueprint $table) {
            $table->id();
            $table->longText('name')?->nullable();
            $table->longText('description')?->nullable();
            $table->double('price')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_types');
        Schema::dropIfExists('vehicle_info');
        Schema::dropIfExists('vehicle_images');
        Schema::dropIfExists('vehicle_services');
        Schema::dropIfExists('ambulances');
    }
};
