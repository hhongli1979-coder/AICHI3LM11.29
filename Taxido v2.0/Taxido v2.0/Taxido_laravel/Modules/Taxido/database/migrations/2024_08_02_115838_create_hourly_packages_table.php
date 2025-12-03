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
        Schema::create('hourly_packages', function (Blueprint $table) {
            $table->id();
            $table->enum('distance_type', ['mile', 'km'])->default('km')->nullable();
            $table->decimal('distance', 8, 2)->nullable();
            $table->decimal('hour', 8, 2)->nullable(); 
            $table->integer('status')->default(1);
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');

        });

        Schema::create('vehicle_type_hourly_packages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->unsignedBigInteger('hourly_package_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade');
            $table->foreign('hourly_package_id')->references('id')->on('hourly_packages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hourly_packages');
        Schema::dropIfExists('vehicle_type_hourly_packages');
    }
};
