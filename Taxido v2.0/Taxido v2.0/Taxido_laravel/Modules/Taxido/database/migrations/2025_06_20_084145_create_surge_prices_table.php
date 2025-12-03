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
        Schema::create('surge_prices', function (Blueprint $table) {
            $table->id();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('day')->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });

        Schema::create('vehicle_surge_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_id');
            $table->unsignedBigInteger('zone_id');
            $table->unsignedBigInteger('surge_price_id');
            $table->decimal('amount')->default(0)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_type_id')->references('id')->on('vehicle_types')->onDelete('cascade')->nullable();
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
            $table->foreign('surge_price_id')->references('id')->on('surge_prices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surge_prices');
        Schema::dropIfExists('vehicle_surge_prices');
    }
};
