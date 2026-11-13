<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'origin',
        'logo',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (Brand $brand) {
            if (empty($brand->slug) && ! empty($brand->name)) {
                $brand->slug = Str::slug($brand->name);
            }
        });

        static::updated(function (Brand $brand) {
            if ($brand->wasChanged('name')) {
                $oldName = $brand->getOriginal('name');
                if (! empty($oldName)) {
                    DB::table('products')
                        ->where('producer', $oldName)
                        ->update([
                            'producer' => $brand->name,
                            'series' => $brand->name,
                        ]);
                }
            }
        });
    }

    public function getProductsCountAttribute(): int
    {
        return Product::where('producer', $this->name)->count();
    }
}
