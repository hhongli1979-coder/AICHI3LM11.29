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
        Schema::create('preferences', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->unsignedBigInteger('icon_image_id')->nullable();
            $table->integer('status')->nullable()->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('icon_image_id')->references('id')->on('media')->onDelete('cascade');
        });

        Schema::create('vehicle_type_zone_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_zone_id')->nullable();
            $table->unsignedBigInteger('preference_id')->nullable();
            $table->double('price')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_type_zone_id')->references('id')->on('vehicle_type_zones')->onDelete('cascade');
            $table->foreign('preference_id')->references('id')->on('preferences')->onDelete('cascade');
        });

        Schema::create('driver_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('preference_id')->nullable();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('preference_id')->references('id')->on('preferences')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preferences');
        Schema::dropIfExists('driver_preferences');
        Schema::dropIfExists('vehicle_type_zone_preferences');
    }
};
