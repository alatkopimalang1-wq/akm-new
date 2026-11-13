<?php

namespace App\Support;

use Filament\Support\Icons\Heroicon;

class IconCatalog
{
    /**
     * Curated catalog of icons tailored for coffee, terroir, roasting, tools, and commerce.
     * Stored keys match standard Lucide icon identifiers used on the React frontend.
     *
     * @return array<string, array<string, string>>
     */
    public static function options(): array
    {
        return [
            'Fasilitas & Ruangan' => [
                'zap' => 'Zap (Listrik / AC / Daya)',
                'wifi' => 'Wifi (Internet / Koneksi Cepat)',
                'plug' => 'Plug (Colokan Listrik / Stopkontak)',
                'building-2' => 'Building (Gedung / Tempat / Parkir)',
                'wind' => 'Wind (AC / Udara Sejuk)',
                'tv' => 'TV / Screen (Proyektor & Layar)',
                'volume-2' => 'Volume (Sound System)',
                'mic' => 'Mic (Mikrofon Wireless)',
                'users' => 'Users (Kapasitas / Komunitas)',
                'shield-check' => 'Shield Check (Keamanan & Terawat)',
                'car' => 'Car (Parkir Kendaraan)',
                'coffee' => 'Coffee (Kopi & Minuman)',
            ],
            'Artikel & Jurnal' => [
                'newspaper' => 'Newspaper (Artikel & Berita)',
                'book-open' => 'Book Open (Jurnal & Edukasi)',
                'feather' => 'Feather (Catatan Roaster / Opini)',
                'bookmark' => 'Bookmark (Koleksi Pilihan)',
                'compass' => 'Compass (Eksplorasi Rasa)',
                'tag' => 'Tag (Topik & Cerita)',
            ],
            'Kopi & Minuman' => [
                'coffee' => 'Coffee Cup (Cangkir Kopi)',
                'droplet' => 'Droplet (Tetesan / Manual Brew)',
                'cup-soda' => 'Cold Brew / Ice Drink (Es Kopi)',
                'milk' => 'Milk (Susu / Latte)',
            ],
            'Terroir & Alam' => [
                'mountain' => 'Mountain (Gunung Kawi)',
                'leaf' => 'Leaf (Daun / Natural Farm)',
                'trees' => 'Trees (Perkebunan Kopi)',
                'sun' => 'Sun (Honey & Sun-dried)',
            ],
            'Sangrai & Inovasi' => [
                'flame' => 'Flame (Roasting / Api Sangrai)',
                'sparkles' => 'Sparkles (Specialty / Unggulan)',
                'flask-conical' => 'Flask (CO-Ferment / Fermentasi)',
                'sliders-horizontal' => 'Sliders (C.Y.B.R Custom Blend)',
            ],
            'Alat & Seduhan' => [
                'scale' => 'Scale (Timbangan Digital)',
                'clock' => 'Clock (Timer Seduh)',
                'wrench' => 'Wrench (Mesin Espresso & Servis)',
                'settings' => 'Gear (Kalibrasi Grinder)',
            ],
            'Toko & Bisnis' => [
                'shopping-bag' => 'Shopping Bag (Katalog Produk)',
                'map-pin' => 'Map Pin (Showroom & Slow Bar Malang)',
                'truck' => 'Truck (Grosir B2B / Wholesale)',
                'book-open' => 'Book Open (Panduan Seduh)',
                'calendar' => 'Calendar (Acara & Cupping)',
                'star' => 'Star (Favorit / Terlaris)',
                'award' => 'Award (SCA Specialty Grade 1)',
                'heart' => 'Heart (Pilihan Pelanggan)',
            ],
        ];
    }

    /**
     * Map icon key to Filament Heroicon for live prefix icon preview in Filament forms and tables.
     */
    public static function getPrefixIcon(?string $icon): ?Heroicon
    {
        if (empty($icon)) {
            return Heroicon::Tag;
        }

        return match ($icon) {
            'newspaper' => Heroicon::Newspaper,
            'feather' => Heroicon::PencilSquare,
            'bookmark' => Heroicon::Bookmark,
            'compass' => Heroicon::GlobeAsiaAustralia,
            'tag' => Heroicon::Tag,
            'zap', 'plug' => Heroicon::Bolt,
            'wifi' => Heroicon::Wifi,
            'building', 'building-2' => Heroicon::BuildingOffice2,
            'wind' => Heroicon::Sparkles,
            'tv' => Heroicon::Tv,
            'volume-2', 'speaker', 'mic' => Heroicon::SpeakerWave,
            'users' => Heroicon::Users,
            'shield-check' => Heroicon::ShieldCheck,
            'car' => Heroicon::Truck,
            'coffee', 'droplet', 'cup-soda', 'milk' => Heroicon::Sparkles,
            'mountain', 'leaf', 'trees' => Heroicon::GlobeAsiaAustralia,
            'sun' => Heroicon::Sun,
            'flame' => Heroicon::Fire,
            'sparkles' => Heroicon::Sparkles,
            'flask-conical' => Heroicon::Beaker,
            'sliders', 'sliders-horizontal' => Heroicon::AdjustmentsHorizontal,
            'scale' => Heroicon::Scale,
            'clock' => Heroicon::Clock,
            'wrench', 'settings' => Heroicon::Wrench,
            'shopping-bag' => Heroicon::ShoppingBag,
            'map-pin' => Heroicon::MapPin,
            'truck' => Heroicon::Truck,
            'book-open' => Heroicon::BookOpen,
            'calendar' => Heroicon::Calendar,
            'star' => Heroicon::Star,
            'award' => Heroicon::Trophy,
            'heart' => Heroicon::Heart,
            default => Heroicon::Tag,
        };
    }
}
