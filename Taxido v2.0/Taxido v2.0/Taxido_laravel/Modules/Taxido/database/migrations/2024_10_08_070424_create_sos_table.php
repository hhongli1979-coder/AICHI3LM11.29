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
        Schema::create('sos', function (Blueprint $table) {
            $table->id();
            $table->text('title')->nullable();
            $table->string('slug', 191)->unique()->nullable();
            $table->unsignedBigInteger('sos_image_id')->nullable();
            $table->string('country_code')->nullable();
            $table->string('phone')->default(0)->nullable();
            $table->bigInteger('created_by_id')->unsigned();
            $table->integer('status')->default(1);
            $table->timestamps();
            $table->softDeletes();
    
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sos_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
        }); 

        Schema::create('sos_zones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('s_o_s_id')->unsigned();
            $table->unsignedBigInteger('zone_id')->unsigned();

            $table->foreign('s_o_s_id')->references('id')->on('sos')->onDelete('cascade')->nullable();
            $table->foreign('zone_id')->references('id')->on('zones')->onDelete('cascade')->nullable();
        });

        Schema::create('sos_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('sos_alerts', function (Blueprint $table) {
            $table->id();
            $table->json('location_coordinates')->nullable();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('sos_id')->nullable();
            $table->unsignedBigInteger('created_by_id')->nullable();
            $table->unsignedBigInteger('sos_status_id')->unsigned();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
            $table->foreign('sos_id')->references('id')->on('sos')->onDelete('cascade'); 
            $table->foreign('sos_status_id')->references('id')->on('sos_statuses')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('sos_status_activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ride_id')->nullable();
            $table->unsignedBigInteger('sos_alert_id')->nullable();
            $table->string('status')->nullable();
            $table->string('changed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sos_alert_id')->references('id')->on('sos_alerts')->onDelete('cascade');
            $table->foreign('ride_id')->references('id')->on('rides')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sos');
        Schema::dropIfExists('sos_zones');
        Schema::dropIfExists('sos_statuses');
        Schema::dropIfExists('sos_alerts');
        Schema::dropIfExists('sos_status_activities');
    }
};
