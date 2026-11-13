<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $preamble = "Sanubari Coffee Beans merupakan biji kopi premium yang dipilih berdasarkan grade terbaik. Yang selalu mempunyai cita rasa yang khas. Dengan level roasting yang disesuaikan dengan kriteria biji kopi. Semua biji kopi yang kopi produksi sudah memiliki ijin edar PIRT dan HALAL.";

        $products = Product::where('slug', '!=', 'byob')->get();

        foreach ($products as $product) {
            $desc = $product->description;
            $idDesc = is_array($desc) ? ($desc['id'] ?? '') : (string) $desc;
            $enDesc = is_array($desc) ? ($desc['en'] ?? '') : (string) $desc;

            if (! str_contains($idDesc, 'Sanubari Coffee Beans merupakan biji kopi premium')) {
                if (str_starts_with($idDesc, 'Kami memilih biji kopi kualitas terbaik')) {
                    $posSpecs = strpos($idDesc, 'Arabica G. Kawi');
                    if ($posSpecs === false) {
                        $posSpecs = strpos($idDesc, 'Variety :');
                    }
                    $specs = $posSpecs !== false ? substr($idDesc, $posSpecs) : $idDesc;
                    $newDesc = $preamble . ' ' . $specs;
                } else {
                    $newDesc = $preamble . ' ' . $idDesc;
                }

                $product->description = [
                    'id' => trim($newDesc),
                    'en' => trim($newDesc),
                ];
                $product->saveQuietly();
            }
        }
    }

    public function down(): void
    {
        // No destructive reversal needed
    }
};
