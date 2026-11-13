<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class BrewGuide extends Post
{
    protected $table = 'posts';

    protected static function booted(): void
    {
        static::addGlobalScope('guide', function (Builder $builder) {
            $builder->where('type', 'guide');
        });

        static::creating(function ($model) {
            $model->type = 'guide';
        });
    }
}
