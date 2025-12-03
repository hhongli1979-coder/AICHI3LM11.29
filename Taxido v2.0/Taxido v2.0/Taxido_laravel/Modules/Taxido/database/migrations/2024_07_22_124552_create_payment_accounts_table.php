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
        Schema::create('payment_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('paypal_email')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_holder_name')->nullable();
            $table->string('bank_account_no')->nullable();
            $table->string('swift')->nullable();
            $table->string('routing_number')->nullable();
            $table->integer('status')->default(1);
            $table->enum('default', ['bank', 'paypal'])->default('bank')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_accounts');
    }
};
