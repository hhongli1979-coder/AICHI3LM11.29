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
        Schema::create('knowledge_bases', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->string('slug', 191)->unique()->nullable();
            $table->longText('description')->nullable();
            $table->longText('content')->nullable();
            $table->text('meta_title')->nullable();
            $table->longText('meta_description')->nullable();
            $table->unsignedBigInteger('knowledge_thumbnail_id')->nullable();
            $table->unsignedBigInteger('knowledge_meta_image_id')->nullable();
            $table->integer('status')->default(1);
            $table->unsignedBigInteger('created_by_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('knowledge_thumbnail_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('knowledge_meta_image_id')->references('id')->on('media')->onDelete('cascade')->nullable();
            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('cascade')->nullable();
        });

        Schema::create('knowledge_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('knowledge_id')->unsigned();
            $table->unsignedBigInteger('category_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('knowledge_id')->references('id')->on('knowledge_bases')->onDelete('cascade')->nullable();
            $table->foreign('category_id')->references('id')->on('knowledge_base_categories')->onDelete('cascade')->nullable();
        });

        Schema::create('knowledge_tags', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('knowledge_id')->unsigned();
            $table->unsignedBigInteger('tag_id')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('knowledge_id')->references('id')->on('knowledge_bases')->onDelete('cascade')->nullable();
            $table->foreign('tag_id')->references('id')->on('knowledge_base_tags')->onDelete('cascade')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_bases');
        Schema::dropIfExists('knowledge_categories');
        Schema::dropIfExists('knowledge_tags');
    }
};
