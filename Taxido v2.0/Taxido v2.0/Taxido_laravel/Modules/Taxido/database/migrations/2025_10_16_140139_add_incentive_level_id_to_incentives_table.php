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
        Schema::table('incentives', function (Blueprint $table) {
            $table->unsignedBigInteger('incentive_level_id')->nullable()->after('driver_id');
            $table->foreign('incentive_level_id')->references('id')->on('incentive_levels')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incentives', function (Blueprint $table) {
            $table->dropForeign(['incentive_level_id']);
            $table->dropIndex(['incentive_level_id', 'driver_id']);
            $table->dropColumn('incentive_level_id');
        });
    }
};
