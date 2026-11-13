<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class Event extends Post
{
    protected $table = 'posts';

    protected $appends = [
        'is_published',
        'formatted_date',
        'formatted_time',
        'formatted_schedule',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope('event', function (Builder $builder) {
            $builder->where('type', 'event');
        });

        static::creating(function ($model) {
            $model->type = 'event';
        });
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->where('starts_at', '>=', now())
                ->orWhere(function (Builder $sub) {
                    $sub->whereNotNull('ends_at')->where('ends_at', '>=', now());
                });
        })->orderBy('starts_at');
    }

    public function getTitleTextAttribute(): string
    {
        return $this->getTranslation('title', 'id') ?? (is_array($this->title) ? ($this->title['id'] ?? reset($this->title)) : (string) ($this->title ?? ''));
    }

    public function getDescriptionTextAttribute(): string
    {
        return $this->getTranslation('description', 'id') ?? (is_array($this->description) ? ($this->description['id'] ?? reset($this->description)) : (string) ($this->description ?? ''));
    }

    public function getFormattedDateAttribute(): ?string
    {
        return $this->starts_at ? $this->starts_at->locale('id')->translatedFormat('l, j F Y') : null;
    }

    public function getFormattedTimeAttribute(): ?string
    {
        if (! $this->starts_at) {
            return null;
        }

        $time = $this->starts_at->format('H.i');
        if ($this->ends_at) {
            $time .= ' - ' . $this->ends_at->format('H.i');
        }

        return $time . ' WIB';
    }

    public function getFormattedScheduleAttribute(): ?string
    {
        if (! $this->starts_at) {
            return null;
        }

        $schedule = $this->starts_at->locale('id')->translatedFormat('l, j F Y') . ' pukul ' . $this->starts_at->format('H.i');
        if ($this->ends_at) {
            $schedule .= ' - ' . $this->ends_at->format('H.i');
        }

        return $schedule . ' WIB';
    }
}
