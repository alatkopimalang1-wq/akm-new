<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $oldNums = ['6285121930454', '+6285121930454', '0851-2193-0454', '085121930454', '0851 2193 0454'];
        $newWa = '6282132095241';
        $newPhone = '+6282132095241';
        $newDisplay = '0821-3209-5241';

        // 1. Update basic settings keys
        Setting::set('whatsapp', $newWa);
        Setting::set('phone', $newPhone);
        Setting::set('footer_phone', $newPhone);
        Setting::set('footer_wa_number', $newWa);
        Setting::set('shipping_sender_phone', $newDisplay);
        Setting::set('order_admin_wa_number', $newWa);
        Setting::set('invoice_phone', $newPhone);

        // 2. Update JSON settings
        $allSettings = DB::table('settings')->get();
        foreach ($allSettings as $row) {
            $val = $row->value;
            $updated = false;

            // Check if string contains old numbers
            if (is_string($val)) {
                $newVal = str_replace(
                    ['+6285121930454', '6285121930454', '0851-2193-0454', '085121930454'],
                    [$newPhone, $newWa, $newDisplay, $newWa],
                    $val
                );
                if ($newVal !== $val) {
                    $val = $newVal;
                    $updated = true;
                }
            }

            if ($updated) {
                DB::table('settings')->where('id', $row->id)->update([
                    'value' => $val,
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Update mega_menus table if any
        if (\Illuminate\Support\Facades\Schema::hasTable('mega_menus')) {
            $menus = DB::table('mega_menus')->get();
            foreach ($menus as $m) {
                if (!empty($m->featured_url) && str_contains($m->featured_url, '6285121930454')) {
                    DB::table('mega_menus')->where('id', $m->id)->update([
                        'featured_url' => str_replace('6285121930454', $newWa, $m->featured_url),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        Cache::flush();
    }

    public function down(): void
    {
        // No need to revert
    }
};
