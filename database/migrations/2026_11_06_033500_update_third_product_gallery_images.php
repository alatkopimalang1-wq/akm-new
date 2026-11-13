<?php

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $newPath = 'products/gallery/roasting-pratter-cooling.jpg';

        // Ensure physical asset is copied to storage and public storage
        $seedAsset = resource_path('seed-assets/' . $newPath);
        if (file_exists($seedAsset)) {
            $destStorage = storage_path('app/public/' . $newPath);
            $destPublic = public_path('storage/' . $newPath);
            
            @mkdir(dirname($destStorage), 0755, true);
            @copy($seedAsset, $destStorage);

            @mkdir(dirname($destPublic), 0755, true);
            @copy($seedAsset, $destPublic);

            // Also ensure featured-menu/laris-3.jpg fallback is refreshed
            $larisStorage = storage_path('app/public/featured-menu/laris-3.jpg');
            $larisPublic = public_path('storage/featured-menu/laris-3.jpg');
            @mkdir(dirname($larisStorage), 0755, true);
            @copy($seedAsset, $larisStorage);
            @mkdir(dirname($larisPublic), 0755, true);
            @copy($seedAsset, $larisPublic);
        }

        $products = Product::with(['images' => fn ($q) => $q->orderBy('sort_order')])->get();

        foreach ($products as $product) {
            // Skip non-coffee or products without any gallery images (e.g. CYBR)
            if ($product->images->isEmpty()) {
                continue;
            }

            $images = $product->images->values();

            if ($images->count() >= 3) {
                // Update the 3rd gallery image (index 2)
                $images[2]->update([
                    'path' => $newPath,
                    'alt' => $product->name . ' - Proses Roasting Sangrai Sanubari',
                    'is_primary' => false,
                ]);
            } else {
                // Product has 1 or 2 images, append the roasting photo as the 3rd image
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $newPath,
                    'alt' => $product->name . ' - Proses Roasting Sangrai Sanubari',
                    'sort_order' => 2,
                    'is_primary' => false,
                ]);
            }
        }
    }

    public function down(): void
    {
        // No-op rollback since photos can be customized via Filament admin
    }
};
