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
        Schema::table('cab_referral_bonuses', function (Blueprint $table) {
            // Add new columns for enhanced referral system
            $table->enum('referrer_type', ['rider', 'driver'])->default('rider')->after('referred_id');
            $table->enum('referred_type', ['rider', 'driver'])->default('rider')->after('referrer_type');
            $table->decimal('ride_amount', 10, 2)->default(0.00)->after('referred_type');
            $table->decimal('referrer_percentage', 5, 2)->default(0.00)->after('ride_amount');
            $table->decimal('referred_percentage', 5, 2)->default(0.00)->after('referrer_percentage');

            $table->decimal('referred_bonus_amount', 8, 2)->default(0.00)->after('referred_percentage');
            $table->string('currency_symbol')->nullable()->after('referrer_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cab_referral_bonuses', function (Blueprint $table) {
            $table->dropColumn([
                'referrer_type',
                'referred_type',
                'ride_amount',
                'referrer_percentage',
                'referred_percentage',
                'referred_bonus_amount'
            ]);
        });
    }
};
