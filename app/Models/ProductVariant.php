<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'label',
        'weight_grams',
        'price',
        'original_price',
        'stock_status',
        'sku',
        'image',
    ];

    protected $casts = [
        'weight_grams' => 'integer',
        'price' => 'float',
        'original_price' => 'float',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image)) {
            return null;
        }

        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return Storage::url($this->image);
    }

    public static function parseWeightFromLabel(?string $label): ?int
    {
        if (empty($label)) {
            return null;
        }

        if (preg_match('/(\d+(?:[.,]\d+)?)\s*kg\b/i', $label, $matches)) {
            $val = (float) str_replace(',', '.', $matches[1]);
            return (int) round($val * 1000);
        }

        if (preg_match('/(\d+)\s*(?:gr|gram|g)\b/i', $label, $matches)) {
            return (int) $matches[1];
        }

        if (preg_match('/^(\d+)$/', trim($label), $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    public static function syncLabelWithWeight(?string $currentLabel, int $weightGrams): string
    {
        if ($weightGrams <= 0) {
            return (string) $currentLabel;
        }

        $trimmed = trim((string) $currentLabel);
        if ($trimmed === '' || preg_match('/^\d+$/', $trimmed)) {
            return $weightGrams . ' gr';
        }

        if (preg_match('/^(\d+(?:[.,]\d+)?)(\s*)(gr|gram|g|kg)(\b.*)$/i', $trimmed, $matches)) {
            $space = $matches[2] !== '' ? $matches[2] : ' ';
            $unit = $matches[3];
            $suffix = $matches[4];

            if (strtolower($unit) === 'kg') {
                if ($weightGrams >= 1000 && $weightGrams % 1000 === 0) {
                    return ($weightGrams / 1000) . $space . $unit . $suffix;
                }
                return $weightGrams . ' gr' . $suffix;
            }

            return $weightGrams . $space . $unit . $suffix;
        }

        return (string) $currentLabel;
    }

    protected static function booted(): void
    {
        static::saving(function (ProductVariant $variant) {
            if ((int) $variant->weight_grams <= 0) {
                $parsed = static::parseWeightFromLabel((string) $variant->label);
                $variant->weight_grams = ($parsed !== null && $parsed > 0) ? $parsed : 1000;
            }
        });

        static::saved(function (ProductVariant $variant) {
            $variant->product?->syncPricesFromVariants();
        });

        static::deleted(function (ProductVariant $variant) {
            $variant->product?->syncPricesFromVariants();
        });
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
