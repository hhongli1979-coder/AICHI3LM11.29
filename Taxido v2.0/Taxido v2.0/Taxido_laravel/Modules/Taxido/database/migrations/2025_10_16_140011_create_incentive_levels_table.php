<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incentive_levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_type_zone_id');
            $table->enum('period_type', ['daily', 'weekly']);
            $table->tinyInteger('level_number')->unsigned();
            $table->integer('target_rides')->unsigned();
            $table->decimal('incentive_amount', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('vehicle_type_zone_id')->references('id')->on('vehicle_type_zones')->onDelete('cascade');
            $table->unique(['vehicle_type_zone_id', 'period_type', 'level_number'], 'unique_level_per_period');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incentive_levels');
    }
};
