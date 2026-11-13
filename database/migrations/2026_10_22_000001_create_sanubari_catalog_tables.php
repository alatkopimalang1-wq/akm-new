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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // {"id": "...", "en": "..."}
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('type')->default('filter'); // filter, espresso, brand, merch
            $table->json('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('series')->default('classic'); // classic, experimental, co-ferment, arabica, robusta, houseblend, kawi
            $table->json('tagline')->nullable();
            $table->json('description')->nullable();
            $table->string('short_description')->nullable();
            $table->string('tasting_notes')->nullable();
            $table->string('origin')->nullable();
            $table->string('region')->nullable();
            $table->string('farm')->nullable();
            $table->string('producer')->nullable();
            $table->string('varietal')->nullable();
            $table->string('process')->nullable();
            $table->string('altitude')->nullable();
            $table->string('roast_level')->nullable();
            $table->json('brew_methods')->nullable();
            $table->integer('freshness_days')->default(30);
            $table->decimal('min_price', 12, 2)->default(0);
            $table->decimal('max_price', 12, 2)->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->string('status')->default('active'); // active, draft, archived
            $table->timestamp('released_at')->nullable();
            $table->timestamps();
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('label'); // e.g. "100g", "200g", "500g", "1kg", "15g"
            $table->integer('weight_grams')->default(200);
            $table->decimal('price', 12, 2);
            $table->decimal('original_price', 12, 2)->nullable();
            $table->string('stock_status')->default('in_stock'); // in_stock, out_of_stock, pre_order
            $table->string('sku')->nullable();
            $table->timestamps();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('path');
            $table->string('alt')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('category_product', function (Blueprint $table) {
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->primary(['category_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
