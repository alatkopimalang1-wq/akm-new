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
        Schema::create('mega_menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // e.g. 'shop', 'b2b', 'explore'
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            // Featured Promo Card (1 image per mega menu)
            $table->string('featured_badge')->nullable();
            $table->string('featured_title')->nullable();
            $table->text('featured_subtitle')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('featured_url')->nullable();
            $table->string('featured_button_text')->nullable();

            $table->timestamps();
        });

        Schema::create('mega_menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mega_menu_id')->constrained('mega_menus')->cascadeOnDelete();
            $table->string('section_title'); // Group/column title e.g. 'Kategori Biji Kopi'
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('url');
            $table->string('icon')->nullable();
            $table->string('badge')->nullable();
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
        Schema::dropIfExists('mega_menu_items');
        Schema::dropIfExists('mega_menus');
    }
};
