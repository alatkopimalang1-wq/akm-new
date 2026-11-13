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
        Schema::create('video_reels', function (Blueprint $table) {
            $table->id();
            $table->string('headline');
            $table->text('caption');
            $table->string('badge')->nullable();
            $table->string('thumbnail');
            $table->string('video_url');
            $table->unsignedInteger('product_count')->default(0);
            $table->json('products')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_reels');
    }
};
