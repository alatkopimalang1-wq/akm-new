<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'brand',
        'sku',
        'tagline',
        'short_description',
        'description',
        'price',
        'original_price',
        'stock',
        'rating',
        'reviews_count',
        'specifications',
        'tokopedia_url',
        'shopee_url',
        'is_featured',
        'is_flash_sale',
        'status',
        'stock_status',
    ];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'stock' => 'integer',
        'rating' => 'float',
        'reviews_count' => 'integer',
        'specifications' => 'array',
        'is_featured' => 'boolean',
        'is_flash_sale' => 'boolean',
    ];

    protected $appends = [
        'primary_image_url',
        'discount_percent',
    ];

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            $primary = $this->images->firstWhere('is_primary', true) ?: $this->images->first();
            return $primary ? $primary->path : null;
        }

        $image = $this->images()->where('is_primary', true)->first() ?: $this->images()->first();
        return $image ? $image->path : null;
    }

    public function getDiscountPercentAttribute(): int
    {
        if ($this->original_price && $this->original_price > $this->price && $this->price > 0) {
            return (int) round((($this->original_price - $this->price) / $this->original_price) * 100);
        }
        return 0;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeFlashSale(Builder $query): Builder
    {
        return $query->where('is_flash_sale', true);
    }
}

