<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Modules\Taxido\Enums\ServiceCategoryEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->enum('type', [
                ServiceCategoryEnum::RIDE,
                ServiceCategoryEnum::INTERCITY,
                ServiceCategoryEnum::RENTAL,
                ServiceCategoryEnum::SCHEDULE,
                ServiceCategoryEnum::PACKAGE,
            ])->default(ServiceCategoryEnum::RIDE)->nullable();
            $table->unsignedBigInteger('service_category_image_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('service_category_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        });

        Schema::create('categories_services',function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_category_id')->unsigned();
            $table->unsignedBigInteger('service_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade')->nullable();
        });

        Schema::create('vehicle_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_id');
            $table->unsignedBigInteger('service_category_id')->unsigned();

            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade')->nullable();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('service_category_id')->nullable();

            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade')->nullable();
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_categories');
        Schema::dropIfExists('categories_services');
        Schema::dropIfExists('vehicle_categories');
        Schema::dropIfExists('coupon_categories');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('service_id');
            $table->dropColumn('service_category_id');
        });
    }
};
