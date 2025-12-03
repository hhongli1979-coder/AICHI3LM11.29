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

        Schema::create('withdraw_requests', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 8, 2)->default(0.0)->nullable();
            $table->string('message')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->nullable()->default('pending');
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('driver_wallet_id')->nullable();
            $table->enum('payment_type', ['paypal', 'bank'])->nullable()->default('bank');
            $table->integer('is_used')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_wallet_id')->references('id')->on('driver_wallets')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('fleet_withdraw_requests', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 8, 2)->default(0.0)->nullable();
            $table->string('message')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->nullable()->default('pending');
            $table->unsignedBigInteger('fleet_wallet_id')->nullable();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->enum('payment_type', ['paypal', 'bank'])->nullable()->default('bank');
            $table->integer('is_used_by_admin')->default(0);
            $table->integer('is_used')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fleet_wallet_id')->references('id')->on('fleet_manager_wallets')->onDelete('cascade');
            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdraw_requests');

    }
};
