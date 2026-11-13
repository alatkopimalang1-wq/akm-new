<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $setting = Setting::where('key', 'home_editorial_items')->first();

        if ($setting && is_array($setting->value)) {
            $items = $setting->value;
            $updated = false;

            foreach ($items as &$item) {
                if (isset($item['badge']) && strcasecmp(trim($item['badge']), 'catatan roaster') === 0) {
                    $item['badge'] = null;
                    $updated = true;
                }
            }

            if ($updated) {
                $setting->value = $items;
                $setting->save();
            }
        }
    }

    public function down(): void
    {
        // No-op rollback
    }
};
