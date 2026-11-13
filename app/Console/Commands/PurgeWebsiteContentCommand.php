<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PurgeWebsiteContentCommand extends Command
{
    protected $signature = 'akm:purge-content';

    protected $description = 'Purge selected website database content (products, categories, posts, brew guides, events, reels, banners, orders, and dummy settings)';

    public function handle(): int
    {
        Schema::disableForeignKeyConstraints();

        $tablesToTruncate = [
            'category_product',
            'product_images',
            'product_variants',
            'products',
            'categories',
            'posts',
            'video_reels',
            'hero_banners',
            'showroom_items',
            'order_items',
            'orders',
        ];

        foreach ($tablesToTruncate as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
                $this->info("Truncated table: {$table}");
            }
        }

        Schema::enableForeignKeyConstraints();

        if (Schema::hasTable('settings')) {
            $keysToRemove = [
                'home_hero_slides',
                'home_flash_sale_items',
                'home_flash_sale_is_active',
                'home_new_release_items',
                'home_new_release_is_active',
                'home_back_in_stock_items',
                'home_back_in_stock_is_active',
                'home_rec_product_ids',
                'home_place_items',
                'home_editorial_items',
                'home_partners_slides',
                'home_flavor_items',
                'home_catering_banner_enable',
                'home_catering_banner_image',
                'home_booking_banner_enable',
                'home_booking_banner_image',
                'home_brew_banner_enable',
                'home_brew_banner_image',
                'byob_settings',
                'brew_guide_settings',
                'page_wholesale',
                'page_roasting',
                'page_barista_training',
                'page_events',
                'page_blog',
                'page_booking_tempat',
                'page_coffee_catering',
                'custom_visit_pages',
            ];

            DB::table('settings')->whereIn('key', $keysToRemove)->delete();
            $this->info('Removed deleted-page and dummy homepage settings keys.');

            // Reset footer_settings links to only valid active pages
            $footerSettings = Setting::get('footer_settings');
            if (is_array($footerSettings)) {
                $footerSettings['column_2_links'] = [
                    ['label' => 'Tentang Kami', 'url' => '/tentang', 'is_external' => false, 'is_active' => true],
                    ['label' => 'Lacak Pesanan & Pembayaran', 'url' => '/lacak-pesanan', 'is_external' => false, 'is_active' => true],
                ];
                $footerSettings['column_3_title'] = 'Katalog & Showroom';
                $footerSettings['column_3_links'] = [
                    ['label' => 'Katalog Produk', 'url' => '/shop', 'is_external' => false, 'is_active' => true],
                    ['label' => 'Semua Kategori', 'url' => '/kategori', 'is_external' => false, 'is_active' => true],
                    ['label' => 'Kunjungi Showroom', 'url' => '/kunjungi', 'is_external' => false, 'is_active' => true],
                ];
                Setting::set('footer_settings', $footerSettings);
                $this->info('Updated footer_settings links.');
            }
        }

        Cache::flush();
        $this->info('Purge completed and cache flushed.');

        return self::SUCCESS;
    }
}
