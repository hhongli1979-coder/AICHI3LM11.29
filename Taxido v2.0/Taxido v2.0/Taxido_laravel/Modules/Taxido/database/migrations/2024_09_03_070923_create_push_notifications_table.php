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
        Schema::create('push_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255)->nullable();
            $table->string('message', 255)->nullable();
            $table->string('send_to', 255)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->longText('url')->nullable();
            $table->boolean('is_read')->default(0);
            $table->unsignedBigInteger('image_id')->nullable();
            $table->string('notification_type')->nullable();
            $table->bigInteger('created_by_id')->unsigned();
            $table->integer("is_scheduled")?->default(0)->nullable();
            $table->timestamp("scheduled_at")->nullable();
            $table->timestamp("delivered_at")->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('image_id')->references('id')->on('media')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('push_notifications');
    }
};
