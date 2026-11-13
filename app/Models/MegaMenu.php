<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class MegaMenu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'sort_order',
        'is_active',
        'featured_badge',
        'featured_title',
        'featured_subtitle',
        'featured_image',
        'featured_url',
        'featured_button_text',
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

    public function items(): HasMany
    {
        return $this->hasMany(MegaMenuItem::class)->orderBy('sort_order');
    }
}
