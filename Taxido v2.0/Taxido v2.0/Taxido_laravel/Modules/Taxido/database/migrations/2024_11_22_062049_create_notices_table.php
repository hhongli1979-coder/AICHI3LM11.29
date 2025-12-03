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
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('message', 255)->nullable();
            $table->enum('send_to', ['all', 'particular'])->default('all')->nullable();
            $table->integer('status')->default(1)->nullable();
            $table->string('color')->nullable();
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('notice_drivers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('notice_id')->unsigned();
            $table->unsignedBigInteger('driver_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('notice_id')->references('id')->on('notices')->onDelete('cascade')->nullable();
            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
        Schema::dropIfExists('notice_drivers');

    }
};
