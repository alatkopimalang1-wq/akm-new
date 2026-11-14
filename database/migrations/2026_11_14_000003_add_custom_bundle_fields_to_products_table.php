<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'is_custom_bundle')) {
                $table->boolean('is_custom_bundle')->default(false)->after('is_preorder');
            }
            if (! Schema::hasColumn('products', 'bundle_config')) {
                $table->json('bundle_config')->nullable()->after('is_custom_bundle');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $cols = [];
            if (Schema::hasColumn('products', 'is_custom_bundle')) {
                $cols[] = 'is_custom_bundle';
            }
            if (Schema::hasColumn('products', 'bundle_config')) {
                $cols[] = 'bundle_config';
            }
            if (! empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};
