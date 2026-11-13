<?php

namespace App\Console\Commands;

use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RebrandAlatKopiMalangCommand extends Command
{
    protected $signature = 'akm:rebrand';

    protected $description = 'Replace all occurrences of Sanubari store name in database settings and content with Alat Kopi Malang';

    public function handle(): int
    {
        $this->info('Starting database rebrand to Alat Kopi Malang...');

        // 1. Settings table
        if (Schema::hasTable('settings')) {
            $settings = Setting::all();
            foreach ($settings as $setting) {
                $original = $setting->value;
                $updated = $this->transformValue($original);
                if ($updated !== $original) {
                    $setting->value = $updated;
                    $setting->save();
                    $this->line("Updated setting: {$setting->key}");
                }
            }
        }

        // 2. Generic table column updater via DB::table
        $tableColumns = [
            'posts' => [
                'title',
                'excerpt',
                'body',
                'description',
                'author_name',
                'steps',
                'location',
                'address',
                'whatsapp_register_text',
                'meta',
                'layup_content',
            ],
            'products' => [
                'name',
                'subtitle',
                'description',
                'short_description',
                'tasting_notes',
                'origin',
                'roast_level',
            ],
            'categories' => [
                'name',
                'description',
            ],
            'hero_banners' => [
                'title',
                'subtitle',
                'badge',
                'button_text',
                'secondary_button_text',
            ],
            'video_reels' => [
                'title',
                'description',
                'author',
                'tag',
            ],
            'mega_menus' => [
                'name',
            ],
            'mega_menu_items' => [
                'title',
                'description',
                'badge',
            ],
        ];

        foreach ($tableColumns as $table => $columns) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            $existingCols = array_values(array_filter($columns, fn ($col) => Schema::hasColumn($table, $col)));
            if (empty($existingCols)) {
                continue;
            }

            $rows = DB::table($table)->get();
            foreach ($rows as $row) {
                $updates = [];
                foreach ($existingCols as $col) {
                    $val = $row->{$col} ?? null;
                    if (is_string($val) && stripos($val, 'sanubari') !== false) {
                        $newVal = $this->replaceString($val);
                        if ($newVal !== $val) {
                            $updates[$col] = $newVal;
                        }
                    }
                }
                if (! empty($updates)) {
                    DB::table($table)->where('id', $row->id)->update($updates);
                    $this->line("Updated {$table} #{$row->id} (" . implode(', ', array_keys($updates)) . ')');
                }
            }
        }

        Cache::forget('sanubari_settings');
        $this->info('Database rebrand to Alat Kopi Malang completed!');

        return self::SUCCESS;
    }

    private function transformValue(mixed $val): mixed
    {
        if (is_array($val)) {
            $out = [];
            foreach ($val as $k => $v) {
                $out[$k] = $this->transformValue($v);
            }

            return $out;
        }

        if (is_string($val)) {
            return $this->replaceString($val);
        }

        return $val;
    }

    private function replaceString(string $s): string
    {
        if (stripos($s, 'sanubari') === false) {
            return $s;
        }

        // Protect image storage URLs on sanubariroastery.co.id / .id
        $placeholders = [];
        $s = preg_replace_callback(
            '#https?://(?:www\.)?sanubariroastery\.(?:co\.id|id|com)/(?:storage|wp-content)/[^\s"\'<>)]*#i',
            function ($m) use (&$placeholders) {
                $token = '__PROTECTED_URL_' . count($placeholders) . '__';
                $placeholders[$token] = $m[0];

                return $token;
            },
            $s
        );

        // Combined phrases
        $s = preg_replace('/Sanubari Roastery\s*[×x]\s*Alat Kopi Malang/i', 'Alat Kopi Malang', $s);
        $s = preg_replace('/Gedung Sanubari\s*[×x]\s*Alat Kopi Malang/i', 'Gedung Alat Kopi Malang', $s);
        $s = preg_replace('/Sanubari\s*[×x]\s*Alat Kopi Malang/i', 'Alat Kopi Malang', $s);

        // Emails & Social handles
        $s = preg_replace('/(?:info|halo|admin|b2b)@sanubariroastery\.(?:com|co\.id|id)/i', 'info@alatkopimalang.co.id', $s);
        $s = preg_replace('/sanubari\.roastery\.mlg/i', 'alatkopimalang', $s);
        $s = preg_replace('/sanubariroastery/i', 'alatkopimalang', $s);

        // Uppercase
        $s = str_replace('SANUBARI ROASTERY MALANG', 'ALAT KOPI MALANG', $s);
        $s = str_replace('SANUBARI ROASTERY', 'ALAT KOPI MALANG', $s);
        $s = str_replace('SANUBARI', 'ALAT KOPI MALANG', $s);

        // Title / Mixed case
        $s = preg_replace('/Sanubari Roastery Malang/i', 'Alat Kopi Malang', $s);
        $s = preg_replace('/Sanubari Roastery/i', 'Alat Kopi Malang', $s);
        $s = preg_replace('/Sanubari Malang/i', 'Alat Kopi Malang', $s);
        $s = preg_replace('/Roastery Sanubari/i', 'Alat Kopi Malang', $s);
        $s = preg_replace('/Sanubari/i', 'Alat Kopi Malang', $s);

        // Deduplicate "Alat Kopi Malang Malang"
        $s = str_replace('Alat Kopi Malang Malang', 'Alat Kopi Malang', $s);
        $s = str_replace('ALAT KOPI MALANG MALANG', 'ALAT KOPI MALANG', $s);

        foreach ($placeholders as $token => $orig) {
            $s = str_replace($token, $orig, $s);
        }

        return $s;
    }
}
