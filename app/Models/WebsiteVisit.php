<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'ip_address',
        'url',
        'route_name',
        'device',
        'browser',
        'platform',
        'referer',
        'last_activity_at',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeOnline(Builder $query, int $minutes = 5): Builder
    {
        return $query->where('last_activity_at', '>=', Carbon::now()->subMinutes($minutes));
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    public function scopeYesterday(Builder $query): Builder
    {
        return $query->whereDate('created_at', Carbon::yesterday());
    }

    public function scopeLastDays(Builder $query, int $days = 7): Builder
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays($days)->startOfDay());
    }

    public static function getOnlineVisitorsCount(int $minutes = 5): int
    {
        return static::online($minutes)->distinct('visitor_id')->count('visitor_id');
    }

    public static function getTodayUniqueVisitorsCount(): int
    {
        return static::today()->distinct('visitor_id')->count('visitor_id');
    }

    public static function getTodayPageViewsCount(): int
    {
        return static::today()->count();
    }
}
