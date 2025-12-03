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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->enum('duration', ['daily','weekly','monthly', 'yearly'])->default('monthly');
            $table->longText('description')->nullable();
            $table->decimal('price', 8, 2)->default(0.0);
            $table->integer('status')->default(1)->nullable();
            $table->bigInteger('created_by_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('plan_service_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_id');
            $table->unsignedBigInteger('service_category_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade')->nullable();
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade')->nullable();
        });

        Schema::create('driver_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('plan_id')->nullable();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->enum('duration', ['daily','weekly','monthly', 'yearly'])?->nullable()->default('monthly');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->double('total')->default(0.0);
            $table->integer('is_included_free_trial')->nullable()->default(0);
            $table->integer('is_active')->nullable()->default(0);
            $table->longText('payment_method')->nullable();
            $table->string('payment_status')->default('PENDING');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade')->nullable();
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
        Schema::dropIfExists('plan_service_categories');
        Schema::dropIfExists('driver_subscriptions');
    }
};
