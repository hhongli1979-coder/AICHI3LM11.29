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
        Schema::create('driver_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id')->nullable();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->unsignedBigInteger('document_id')->nullable();
            $table->unsignedBigInteger('document_image_id')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->enum('status',['pending','approved', 'rejected'])->default('pending')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('document_image_id')->references('id')->on('media')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });


        Schema::create('fleet_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->unsignedBigInteger('document_id')->nullable();
            $table->unsignedBigInteger('document_image_id')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->enum('status',['pending','approved', 'rejected'])->default('pending')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('document_image_id')->references('id')->on('media')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('vehicle_info_docs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_info_id')->nullable();
            $table->unsignedBigInteger('fleet_manager_id')->nullable();
            $table->unsignedBigInteger('document_id')->nullable();
            $table->unsignedBigInteger('document_image_id')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->enum('status',['pending','approved', 'rejected'])->default('pending')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_info_id')->references('id')->on('vehicle_info')->onDelete('cascade');
            $table->foreign('fleet_manager_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('document_image_id')->references('id')->on('media')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_documents');
        Schema::dropIfExists('fleet_documents');
        Schema::dropIfExists('vehicle_info_docs');
    }
};
