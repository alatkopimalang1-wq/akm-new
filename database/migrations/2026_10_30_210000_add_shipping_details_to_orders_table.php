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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_courier')->nullable()->after('shipping_cost'); // jne, jnt, sicepat, anteraja, pos
            $table->string('shipping_service')->nullable()->after('shipping_courier'); // REG, YES, EZ, BEST
            $table->string('shipping_etd')->nullable()->after('shipping_service'); // 1-2 hari
            $table->string('shipping_province')->nullable()->after('shipping_etd');
            $table->string('shipping_city')->nullable()->after('shipping_province');
            $table->string('shipping_district')->nullable()->after('shipping_city');
            $table->string('shipping_postal_code')->nullable()->after('shipping_district');
            $table->integer('total_weight_grams')->default(200)->after('shipping_postal_code');
            $table->string('tracking_number')->nullable()->after('total_weight_grams'); // No Resi Pengiriman
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_courier',
                'shipping_service',
                'shipping_etd',
                'shipping_province',
                'shipping_city',
                'shipping_district',
                'shipping_postal_code',
                'total_weight_grams',
                'tracking_number',
            ]);
        });
    }
};

