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
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('name');
            $table->string('type');
            $table->string('placeholder')->nullable();
            $table->integer('is_required')->default(1)->nullable();
            $table->string('select_type')->nullable();
            $table->string('options')->nullable();
            $table->integer('status')->default(1);
            $table->integer('system_reserve')->default(0);
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
