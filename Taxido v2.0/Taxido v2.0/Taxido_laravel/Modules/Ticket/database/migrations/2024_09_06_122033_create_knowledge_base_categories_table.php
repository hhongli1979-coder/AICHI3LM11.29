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
        Schema::create('knowledge_base_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->unsignedBigInteger('category_image_id')->nullable();
            $table->integer('status')->default(1);
            $table->string('type')->default('post');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->bigInteger('created_by_id')->unsigned()->nullable();
            $table->string('meta_title')->nullable();
            $table->longText('meta_description')->nullable();
            $table->unsignedBigInteger('category_meta_image_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_image_id')->references('id')->on('media')->onDelete('cascade');
            $table->foreign('category_meta_image_id')->references('id')->on('media')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('knowledge_base_categories')->onDelete('cascade');
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base_categories');
    }
};
