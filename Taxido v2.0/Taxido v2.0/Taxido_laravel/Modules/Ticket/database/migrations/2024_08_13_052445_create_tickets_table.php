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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('name')->nullable();
            $table->string('slug', 191)->unique()->nullable();
            $table->string('ticket_number')->unique()->nullable();
            $table->string('subject')->nullable();
            $table->string('email')->nullable();
            $table->string('product_id')->nullable();
            $table->unsignedBigInteger('department_id')->default(1);
            $table->unsignedBigInteger('priority_id')->nullable();
            $table->string('other_input_field')->nullable();
            $table->unsignedBigInteger('ticket_status_id')->default(1);
            $table->string('note')->nullable();
            $table->integer('status')->default(1);
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
            $table->foreign('priority_id')->references('id')->on('priorities')->onDelete('cascade');
            $table->foreign('ticket_status_id')->references('id')->on('statuses')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('assigned_tickets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
            $table->softDeletes();
        
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('ticket_id')->references('id')->on('tickets')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('assigned_tickets');
    }
};
