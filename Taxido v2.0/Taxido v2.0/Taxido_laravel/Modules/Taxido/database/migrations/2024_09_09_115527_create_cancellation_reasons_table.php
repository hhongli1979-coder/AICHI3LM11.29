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
        Schema::create('cancellation_reasons', function (Blueprint $table) {
            $table->id();
            $table->longText('title')->nullable();
            $table->string('slug', 191)->unique()->nullable();
            $table->enum('for', ['rider', 'driver'])->default('rider')->nullable();
            $table->enum('ride_start', ['before', 'after'])->default('before')->nullable();
            $table->integer('status')->default(1);
            $table->unsignedBigInteger('icon_image_id')->nullable();
            $table->bigInteger('created_by_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

             $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('icon_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellation_reasons');
    }
};
