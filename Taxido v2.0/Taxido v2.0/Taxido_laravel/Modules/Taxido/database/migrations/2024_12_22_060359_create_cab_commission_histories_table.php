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
        Schema::create('cab_commission_histories', function (Blueprint $table) {
            $table->id();
            $table->decimal('admin_commission',8,2)->default(0.0)->nullable();
            $table->decimal('driver_commission',8,2)->default(0.0)->nullable();
            $table->decimal('fleet_commission',8,2)->default(0.0)->nullable();
            $table->decimal('commission_rate',8,2)->default(0.0)->nullable();
            $table->string('commission_type')->nullable();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cab_commission_histories');
    }
};
