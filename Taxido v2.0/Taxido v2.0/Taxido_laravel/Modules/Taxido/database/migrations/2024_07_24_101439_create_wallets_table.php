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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->decimal('balance',8,2)->default(0.0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('rider_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rider_id')->nullable();
            $table->decimal('balance',8,2)->default(0.0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('driver_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->decimal('balance', 8, 2)->default(0.0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('fleet_manager_wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->decimal('balance', 8, 2)->default(0.0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('rider_wallets');
        Schema::dropIfExists('driver_wallets');
        Schema::dropIfExists('wallet_histories');
        Schema::dropIfExists('fleet_manager_wallets');
    }
};
