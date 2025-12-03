<?php

use Illuminate\Support\Facades\Schema;
use Modules\Taxido\Enums\ServicesEnum;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('service_image_id')->nullable();
            $table->unsignedBigInteger('service_icon_id')->nullable();
            $table->enum('type', [
                ServicesEnum::CAB,
                ServicesEnum::PARCEL,
                ServicesEnum::FREIGHT,
                ServicesEnum::AMBULANCE,
            ])->default(ServicesEnum::CAB)->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->integer('is_primary')->default(0)->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('service_icon_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        });

        Schema::create('banner_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('banner_id')->unsigned();
            $table->unsignedBigInteger('service_id')->unsigned();

            $table->foreign('banner_id')->references('id')->on('banners')->onDelete('cascade')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
        Schema::dropIfExists('banner_services');
    }
};
