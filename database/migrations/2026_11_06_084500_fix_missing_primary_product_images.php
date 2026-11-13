<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $products = Product::whereHas('images')
            ->whereDoesntHave('images', fn ($q) => $q->where('is_primary', true))
            ->get();

        foreach ($products as $product) {
            $product->images()->orderBy('sort_order')->orderBy('id')->first()?->update([
                'is_primary' => true,
            ]);
        }
    }

    public function down(): void
    {
        // No-op rollback
    }
};
