<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'unique_code' => 'integer',
        'payment_details' => 'array',
        'paid_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (Order $order) {
            if ($order->payment_status === 'paid' && ! $order->paid_at) {
                $order->paid_at = now();
            }
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateOrderNumber(): string
    {
        $date = now()->format('ymd');
        $random = strtoupper(Str::random(4));
        $number = "SNB-{$date}-{$random}";

        while (static::where('order_number', $number)->exists()) {
            $random = strtoupper(Str::random(4));
            $number = "SNB-{$date}-{$random}";
        }

        return $number;
    }

    public function getPaymentMethodLabelAttribute(): string
    {
        return match ($this->payment_method) {
            'qris' => 'QRIS Toko Resmi (Instan)',
            'bank_transfer' => 'Transfer Bank (' . strtoupper((string) ($this->payment_channel ?? 'BCA')) . ')',
            'whatsapp' => 'WhatsApp Order',
            default => ucfirst((string) $this->payment_method),
        };
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return match ($this->payment_status) {
            'pending' => 'Menunggu Pembayaran',
            'verifying' => 'Menunggu Verifikasi Pembayaran',
            'paid' => 'Pembayaran Berhasil / Lunas',
            'cancelled' => 'Dibatalkan',
            default => ucfirst((string) $this->payment_status),
        };
    }

    public function getIsPickupAttribute(): bool
    {
        return $this->shipping_courier === 'Ambil di Toko'
            || str_contains(strtolower((string) $this->shipping_courier), 'pickup')
            || str_contains(strtolower((string) $this->shipping_courier), 'ambil');
    }

    public function getStatusLabelAttribute(): string
    {
        $isPickup = $this->is_pickup;

        return match ($this->status) {
            'pending' => 'Menunggu Konfirmasi',
            'processing' => 'Sedang Diproses & Disangrai',
            'ready_for_pickup' => 'Siap Diambil di Roastery',
            'shipped' => $isPickup ? 'Siap Diambil di Roastery' : 'Dalam Pengiriman Kurir',
            'completed' => $isPickup ? 'Pesanan Selesai (Sudah Diambil)' : 'Pesanan Selesai',
            'cancelled' => 'Pesanan Dibatalkan',
            default => ucfirst((string) $this->status),
        };
    }
}

