<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Crumbls\Layup\Concerns\HasLayupContent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory, HasTranslations, HasLayupContent;

    protected $table = 'posts';

    protected string $layupContentColumn = 'layup_content';

    protected $appends = ['is_published'];

    protected $fillable = [
        'type',
        'title',
        'slug',
        'category',
        'excerpt',
        'body',
        'content',
        'description',
        'cover_image',
        'author_name',
        'read_time_minutes',
        'published_at',
        'sort_order',

        // Guide attributes
        'method',
        'difficulty',
        'brew_time',
        'ratio',
        'grind_size',
        'water_temp',
        'steps',

        // Event attributes
        'location',
        'address',
        'fee',
        'capacity',
        'starts_at',
        'ends_at',
        'status',
        'whatsapp_register_text',

        'meta',
        'layup_content',
    ];

    protected $casts = [
        'title' => 'array',
        'excerpt' => 'array',
        'body' => 'array',
        'description' => 'array',
        'steps' => 'array',
        'meta' => 'array',
        'layup_content' => 'array',
        'fee' => 'float',
        'capacity' => 'integer',
        'read_time_minutes' => 'integer',
        'sort_order' => 'integer',
        'published_at' => 'datetime',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function getContentAttribute(): ?string
    {
        return $this->getTranslation('body', 'id')
            ?? (is_array($this->body) ? ($this->body['id'] ?? null) : $this->body)
            ?? $this->getTranslation('excerpt', 'id');
    }

    public function setContentAttribute($value): void
    {
        $body = $this->body ?? [];
        if (is_array($body)) {
            $body['id'] = $value;
            $this->body = $body;
        } else {
            $this->body = ['id' => $value];
        }
    }

    public function getIsPublishedAttribute(): bool
    {
        return ! empty($this->published_at) && $this->published_at <= now();
    }

    public function renderContentHtml(): ?string
    {
        if (! empty($this->layup_content)) {
            try {
                $html = $this->toHtml();
                if (! empty(trim($html))) {
                    return $html;
                }
            } catch (\Throwable $e) {
                logger()->error('Layup render failed for post ' . $this->id, ['error' => $e->getMessage()]);
            }
        }

        return null;
    }

    public function scopeArticles(Builder $query): Builder
    {
        return $query->where('type', 'article');
    }

    public function scopeGuides(Builder $query): Builder
    {
        return $query->where('type', 'guide');
    }

    public function scopeEvents(Builder $query): Builder
    {
        return $query->where('type', 'event');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('type', 'event')
            ->where('starts_at', '>=', now())
            ->orderBy('starts_at');
    }
}
