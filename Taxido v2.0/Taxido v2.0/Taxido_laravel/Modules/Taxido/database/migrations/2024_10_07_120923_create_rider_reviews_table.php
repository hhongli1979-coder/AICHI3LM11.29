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
        Schema::create('rider_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->unsignedBigInteger('service_id')->nullable();
            $table->unsignedBigInteger('service_category_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->longText('message')->nullable();
            $table->decimal('rating', 8, 2)->default(0.0)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rider_reviews');
    }

};
