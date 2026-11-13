<?php

namespace App\Console\Commands;

use App\Models\BrewGuide;
use App\Models\Category;
use App\Models\Event;
use App\Models\HeroBanner;
use App\Models\MegaMenu;
use App\Models\MegaMenuItem;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use App\Models\VideoReel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
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

        // 2. Hero Banners
        if (Schema::hasTable('hero_banners')) {
            foreach (HeroBanner::all() as $banner) {
                $dirty = false;
                foreach (['title', 'subtitle', 'badge', 'button_text', 'secondary_button_text'] as $field) {
                    $val = $banner->getAttributes()[$field] ?? null;
                    if ($val) {
                        $newVal = $this->replaceString($val);
                        if ($newVal !== $val) {
                            $banner->setRawAttributes(array_merge($banner->getAttributes(), [$field => $newVal]));
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $banner->save();
                    $this->line("Updated HeroBanner #{$banner->id}");
                }
            }
        }

        // 3. Products
        if (Schema::hasTable('products')) {
            foreach (Product::all() as $product) {
                $dirty = false;
                foreach (['name', 'subtitle', 'description', 'short_description', 'tasting_notes', 'origin', 'roast_level'] as $field) {
                    $raw = $product->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $product->setAttribute($field, is_array($product->getAttribute($field)) ? json_decode($newRaw, true) : $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $product->save();
                    $this->line("Updated Product #{$product->id}");
                }
            }
        }

        // 4. Categories
        if (Schema::hasTable('categories')) {
            foreach (Category::all() as $cat) {
                $dirty = false;
                foreach (['name', 'description'] as $field) {
                    $raw = $cat->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $cat->setAttribute($field, is_array($cat->getAttribute($field)) ? json_decode($newRaw, true) : $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $cat->save();
                    $this->line("Updated Category #{$cat->id}");
                }
            }
        }

        // 5. Posts
        if (Schema::hasTable('posts')) {
            foreach (Post::all() as $post) {
                $dirty = false;
                foreach (['title', 'excerpt', 'content', 'author_name'] as $field) {
                    $raw = $post->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $post->setAttribute($field, is_array($post->getAttribute($field)) ? json_decode($newRaw, true) : $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $post->save();
                    $this->line("Updated Post #{$post->id}");
                }
            }
        }

        // 6. BrewGuides
        if (Schema::hasTable('brew_guides')) {
            foreach (BrewGuide::all() as $guide) {
                $dirty = false;
                foreach (['title', 'subtitle', 'description', 'steps', 'tips'] as $field) {
                    $raw = $guide->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $guide->setAttribute($field, is_array($guide->getAttribute($field)) ? json_decode($newRaw, true) : $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $guide->save();
                    $this->line("Updated BrewGuide #{$guide->id}");
                }
            }
        }

        // 7. Events
        if (Schema::hasTable('events')) {
            foreach (Event::all() as $event) {
                $dirty = false;
                foreach (['title', 'description', 'location'] as $field) {
                    $raw = $event->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $event->setAttribute($field, is_array($event->getAttribute($field)) ? json_decode($newRaw, true) : $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $event->save();
                    $this->line("Updated Event #{$event->id}");
                }
            }
        }

        // 8. VideoReels
        if (Schema::hasTable('video_reels')) {
            foreach (VideoReel::all() as $reel) {
                $dirty = false;
                foreach (['title', 'description', 'author', 'tag'] as $field) {
                    $raw = $reel->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $newRaw = $this->replaceString($raw);
                        if ($newRaw !== $raw) {
                            $reel->setAttribute($field, $newRaw);
                            $dirty = true;
                        }
                    }
                }
                if ($dirty) {
                    $reel->save();
                    $this->line("Updated VideoReel #{$reel->id}");
                }
            }
        }

        // 9. MegaMenu & MegaMenuItem
        if (Schema::hasTable('mega_menus')) {
            foreach (MegaMenu::all() as $menu) {
                $raw = $menu->getRawOriginal('name');
                if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                    $menu->name = $this->replaceString($raw);
                    $menu->save();
                }
            }
        }
        if (Schema::hasTable('mega_menu_items')) {
            foreach (MegaMenuItem::all() as $item) {
                $dirty = false;
                foreach (['title', 'description', 'badge'] as $field) {
                    $raw = $item->getRawOriginal($field);
                    if (is_string($raw) && stripos($raw, 'sanubari') !== false) {
                        $item->setAttribute($field, $this->replaceString($raw));
                        $dirty = true;
                    }
                }
                if ($dirty) {
                    $item->save();
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
