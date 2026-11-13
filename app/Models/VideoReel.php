<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoReel extends Model
{
    use HasFactory;

    protected $fillable = [
        'headline',
        'caption',
        'badge',
        'thumbnail',
        'video_url',
        'product_count',
        'products',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'products' => 'array',
        'is_active' => 'boolean',
        'product_count' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'videoUrl',
        'productCount',
    ];

    public function getThumbnailAttribute($value): string
    {
        return self::normalizeThumbnailPath($value);
    }

    public static function normalizeThumbnailPath(?string $path): string
    {
        if (empty($path)) {
            return '';
        }

        $trimmed = trim($path);
        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
            return $trimmed;
        }

        // Strip any repeated leading /storage/ or public/ prefixes
        $clean = preg_replace('#^/?(?:(?:storage|public)/)+#', '', $trimmed);
        $clean = ltrim((string) $clean, '/');

        return $clean !== '' ? '/storage/' . $clean : '';
    }

    public function getVideoUrlAttribute(): string
    {
        return $this->attributes['video_url'] ?? '';
    }

    public function getProductCountAttribute(): int
    {
        return $this->attributes['product_count'] ?? (is_array($this->products) ? count($this->products) : 0);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('id', 'desc');
    }
}

