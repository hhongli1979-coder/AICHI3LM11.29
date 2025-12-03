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
        Schema::create('driver_rules', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('slug', 191)->unique()->nullable();
            $table->unsignedBigInteger('rule_image_id')->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->bigInteger('created_by_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('rule_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        });

        Schema::create('driver_vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_rule_id')->nullable();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_rule_id')->references('id')->on('driver_rules')->onDelete('cascade')->nullable();
            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_rules');
        Schema::dropIfExists('driver_vehicle_types');

    }
};
