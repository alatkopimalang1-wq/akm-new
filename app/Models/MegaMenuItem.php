<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class MegaMenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'mega_menu_id',
        'section_title',
        'title',
        'description',
        'url',
        'icon',
        'badge',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('Alat Kopi Malang_mega_menus');
        });

        static::deleted(function () {
            Cache::forget('Alat Kopi Malang_mega_menus');
        });
    }

    public function megaMenu(): BelongsTo
    {
        return $this->belongsTo(MegaMenu::class);
    }
}
