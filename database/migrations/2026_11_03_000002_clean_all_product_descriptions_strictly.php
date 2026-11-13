<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $text = "Sanubari Coffee Beans merupakan biji kopi premium yang dipilih berdasarkan grade terbaik. Yang selalu mempunyai cita rasa yang khas. Dengan level roasting yang disesuaikan dengan kriteria biji kopi. Semua biji kopi yang kopi produksi sudah memiliki ijin edar PIRT dan HALAL.";

        $products = Product::where('slug', '!=', 'byob')->get();

        foreach ($products as $product) {
            $product->description = [
                'id' => $text,
                'en' => $text,
            ];
            $product->saveQuietly();
        }
    }

    public function down(): void
    {
        // No destructive reversal needed
    }
};
