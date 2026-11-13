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
        Schema::table('products', function (Blueprint $table) {
            $table->string('tokopedia_url')->nullable()->after('price_per_10g');
            $table->string('shopee_url')->nullable()->after('tokopedia_url');
            $table->string('tiktok_shop_url')->nullable()->after('shopee_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['tokopedia_url', 'shopee_url', 'tiktok_shop_url']);
        });
    }
};

