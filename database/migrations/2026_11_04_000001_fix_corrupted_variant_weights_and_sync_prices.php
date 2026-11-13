<?php

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $variants = ProductVariant::all();

        foreach ($variants as $variant) {
            $parsed = ProductVariant::parseWeightFromLabel($variant->label);
            $currentWeight = (int) $variant->weight_grams;

            // Repair variants whose weight_grams was overwritten by orderColumn (1, 2, 3...) or '1 kg' -> 1
            if ($currentWeight <= 10) {
                $variant->weight_grams = ($parsed !== null && $parsed > 0) ? $parsed : 200;
                $variant->saveQuietly();
            }
        }

        $products = Product::where('slug', '!=', 'byob')->get();
        foreach ($products as $product) {
            $product->syncPricesFromVariants();
        }
    }

    public function down(): void
    {
        // No destructive reversal needed
    }
};

