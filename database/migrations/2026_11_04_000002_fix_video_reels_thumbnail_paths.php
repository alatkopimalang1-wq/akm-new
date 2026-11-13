<?php

use App\Models\VideoReel;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('video_reels')) {
            return;
        }

        $reels = DB::table('video_reels')->select(['id', 'thumbnail'])->get();

        foreach ($reels as $reel) {
            $normalized = VideoReel::normalizeThumbnailPath($reel->thumbnail);
            if ($normalized !== $reel->thumbnail) {
                DB::table('video_reels')
                    ->where('id', $reel->id)
                    ->update(['thumbnail' => $normalized]);
            }
        }
    }

    public function down(): void
    {
        // Irreversible data cleanup
    }
};

