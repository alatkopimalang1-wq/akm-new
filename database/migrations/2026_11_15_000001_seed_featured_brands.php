<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $featuredBrands = [
            [
                'name' => 'Alat Kopi Malang',
                'slug' => 'alat-kopi-malang',
                'origin' => 'Malang, Indonesia',
                'description' => 'Official Store & Roastery Alat Kopi Malang - Solusi lengkap peralatan seduh kopi manual dan komersial.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Hario',
                'slug' => 'hario',
                'origin' => 'Tokyo, Japan',
                'description' => 'Pionir alat seduh kopi legendaris asal Jepang dengan inovasi V60 dripper dan glassware tahan panas terbaik.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Comandante',
                'slug' => 'comandante',
                'origin' => 'Munich, Germany',
                'description' => 'Grinder manual presisi tinggi standar kejuaraan dunia World Brewers Cup buatan Jerman.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Fellow',
                'slug' => 'fellow',
                'origin' => 'San Francisco, USA',
                'description' => 'Desain minimalis modern untuk kettle elektrik Stagg EKG, vacuum canister Atmos, dan dripper Ode.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Timemore',
                'slug' => 'timemore',
                'origin' => 'Shanghai, China',
                'description' => 'Peralatan seduh kopi berdesain ergonomis dan presisi, dari Chestnut C2/C3 hingga digital scale Black Mirror.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Gemilai',
                'slug' => 'gemilai',
                'origin' => 'Foshan, China',
                'description' => 'Mesin espresso semi-komersial dan home cafe terpercaya dengan performa ekstraksi stabil.',
                'sort_order' => 6,
            ],
            [
                'name' => 'Otten Coffee',
                'slug' => 'otten-coffee',
                'origin' => 'Medan, Indonesia',
                'description' => 'Brand perlengkapan dan specialty coffee terlengkap untuk kebutuhan personal maupun kafe komersial.',
                'sort_order' => 7,
            ],
            [
                'name' => 'Aura Living',
                'slug' => 'aura-living',
                'origin' => 'Jakarta, Indonesia',
                'description' => 'Perlengkapan seduh dan lifestyle coffee ware berkualitas tinggi untuk estetika home brewing Anda.',
                'sort_order' => 8,
            ],
            [
                'name' => 'StudioSound',
                'slug' => 'studiosound',
                'origin' => 'Indonesia',
                'description' => 'Brand kurasi audio dan estetika suasana cafe modern.',
                'sort_order' => 9,
            ],
            [
                'name' => 'HyperStride',
                'slug' => 'hyperstride',
                'origin' => 'Indonesia',
                'description' => 'Perlengkapan aktif dan barista workwear durabel untuk kebutuhan operasional kafe.',
                'sort_order' => 10,
            ],
            [
                'name' => 'Stealth Urban',
                'slug' => 'stealth-urban',
                'origin' => 'Indonesia',
                'description' => 'Aksesoris barista bertema modern minimalis dan industrial matte black.',
                'sort_order' => 11,
            ],
            [
                'name' => 'MechCraft',
                'slug' => 'mechcraft',
                'origin' => 'Indonesia',
                'description' => 'Presisi mekanik untuk coffee gear dan aksesoris tamper, distributor, serta spare parts.',
                'sort_order' => 12,
            ],
            [
                'name' => 'La Marzocco',
                'slug' => 'la-marzocco',
                'origin' => 'Florence, Italy',
                'description' => 'Standar emas mesin espresso komersial buatan tangan dari Florence sejak 1927.',
                'sort_order' => 13,
            ],
            [
                'name' => 'Mahlkönig',
                'slug' => 'mahlkonig',
                'origin' => 'Hamburg, Germany',
                'description' => 'King of Grinders legendaris Jerman dengan burr presisi tinggi seperti EK43 dan E65S.',
                'sort_order' => 14,
            ],
            [
                'name' => 'Breville',
                'slug' => 'breville',
                'origin' => 'Sydney, Australia',
                'description' => 'Mesin espresso all-in-one dan grinder rumah tangga premium Barista Express & Bambino Plus.',
                'sort_order' => 15,
            ],
            [
                'name' => 'Rocket Espresso',
                'slug' => 'rocket-espresso',
                'origin' => 'Milan, Italy',
                'description' => 'Mesin espresso prosumer handmade bergaya klasik Italia Giotto dan Appartamento.',
                'sort_order' => 16,
            ],
            [
                'name' => 'Nuova Simonelli',
                'slug' => 'nuova-simonelli',
                'origin' => 'Belforte del Chienti, Italy',
                'description' => 'Mesin espresso resmi World Barista Championship dengan teknologi T3 & SIS.',
                'sort_order' => 17,
            ],
            [
                'name' => 'AeroPress',
                'slug' => 'aeropress',
                'origin' => 'Palo Alto, USA',
                'description' => 'Alat seduh portabel ikonik dengan ekstraksi cepat, bersih, dan body mantap.',
                'sort_order' => 18,
            ],
            [
                'name' => 'Bodum',
                'slug' => 'bodum',
                'origin' => 'Copenhagen, Denmark',
                'description' => 'French press dan double wall glassware ikonik berdesain Skandinavia fungsional.',
                'sort_order' => 19,
            ],
            [
                'name' => 'Cafec',
                'slug' => 'cafec',
                'origin' => 'Beppu, Japan',
                'description' => 'Kertas saring kopi premium Jepang Abaca dan Flower Dripper dengan airflow optimal.',
                'sort_order' => 20,
            ],
            [
                'name' => 'Normcore',
                'slug' => 'normcore',
                'origin' => 'Hong Kong',
                'description' => 'Aksesoris barista presisi: spring-loaded tamper, WDT tool, dan bottomless portafilter.',
                'sort_order' => 21,
            ],
            [
                'name' => 'Kruve',
                'slug' => 'kruve',
                'origin' => 'Toronto, Canada',
                'description' => 'Sifter pemilah ukuran gilingan kopi dan glassware sensorik kopi spesialti.',
                'sort_order' => 22,
            ],
            [
                'name' => 'Flair Espresso',
                'slug' => 'flair-espresso',
                'origin' => 'California, USA',
                'description' => 'Manual lever espresso maker murni tanpa listrik bertekanan 9 bar sesungguhnya.',
                'sort_order' => 23,
            ],
            [
                'name' => 'Soy Türkiye',
                'slug' => 'soy-turkiye',
                'origin' => 'Istanbul, Turkey',
                'description' => 'Cezve / ibrik tembaga solid buatan tangan pengrajin Grand Bazaar Istanbul.',
                'sort_order' => 24,
            ],
            [
                'name' => 'Monin',
                'slug' => 'monin',
                'origin' => 'Bourges, France',
                'description' => 'Sirup perisa dan puree premium standar kafe dan mixologi internasional.',
                'sort_order' => 25,
            ],
            [
                'name' => 'Metallurgica Motta',
                'slug' => 'metallurgica-motta',
                'origin' => 'Omegna, Italy',
                'description' => 'Milk pitcher Europa stainless steel tebal dan aksesoris barista profesional Italia.',
                'sort_order' => 26,
            ],
            [
                'name' => 'IMS Filtri',
                'slug' => 'ims-filtri',
                'origin' => 'Pavia, Italy',
                'description' => 'Precision filter basket dan shower screen kompetisi espresso made in Italy.',
                'sort_order' => 27,
            ],
            [
                'name' => 'Edelmann',
                'slug' => 'edelmann',
                'origin' => 'Germany',
                'description' => 'Stainless steel barista tools dan milk frothing jug berkualitas tinggi.',
                'sort_order' => 28,
            ],
        ];

        foreach ($featuredBrands as $b) {
            $existing = DB::table('brands')->where('slug', $b['slug'])->orWhere('name', $b['name'])->first();
            if ($existing) {
                DB::table('brands')->where('id', $existing->id)->update([
                    'sort_order' => $b['sort_order'],
                    'origin' => $b['origin'] ?? $existing->origin,
                    'description' => $b['description'] ?? $existing->description,
                    'is_active' => true,
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('brands')->insert([
                    'name' => $b['name'],
                    'slug' => $b['slug'],
                    'origin' => $b['origin'],
                    'description' => $b['description'],
                    'is_active' => true,
                    'sort_order' => $b['sort_order'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep brands data intact
    }
};
