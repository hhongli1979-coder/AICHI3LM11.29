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
        Schema::create('taxido_settings', function (Blueprint $table) {
            $table->id();
            $table->json('taxido_values')->nullable();

            $table->timestamps();
        });
    }                                                                                                                                                                                                       

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxido_settings');
    }
};
