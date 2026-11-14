<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Enrich bundle custom_notes lines with normal & discounted prices (Rp Normal -> Rp Diskon)
     * and compute unit normal price & total normal subtotal.
     *
     * @return array{custom_notes: ?string, original_price: float, price: float, original_subtotal: float, subtotal: float}
     */
    public static function enrichCustomNotesAndPricing(
        ?string $customNotes,
        float $unitDiscountPrice,
        int $quantity = 1,
        ?float $variantOriginalPrice = null
    ): array {
        $qty = max(1, $quantity);

        if (empty($customNotes)) {
            $unitNorm = max((float) ($variantOriginalPrice ?? 0), $unitDiscountPrice);

            return [
                'custom_notes' => $customNotes,
                'original_price' => $unitNorm,
                'price' => $unitDiscountPrice,
                'original_subtotal' => $unitNorm * $qty,
                'subtotal' => $unitDiscountPrice * $qty,
            ];
        }

        $rawLines = preg_split('/\r\n|\r|\n/', trim($customNotes)) ?: [];
        $enrichedLines = [];
        $sumNormal = 0.0;
        $hasBundleLines = false;

        foreach ($rawLines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '') {
                continue;
            }

            // Case 1: Line already has "(Rp Normal -> Rp Diskon)"
            if (preg_match('/\(\s*Rp[\s\x{00a0}]*([\d.]+)\s*(?:->|→)\s*Rp[\s\x{00a0}]*([\d.]+)\s*\)\s*$/iu', $trimmed, $m)) {
                $normVal = (float) str_replace('.', '', $m[1]);
                $discVal = (float) str_replace('.', '', $m[2]);
                $sumNormal += max($normVal, $discVal);
                $hasBundleLines = true;
                $enrichedLines[] = $trimmed;
                continue;
            }

            // Case 2: Line ends with single "(Rp Diskon)"
            if (preg_match('/^(.*)\(\s*Rp[\s\x{00a0}]*([\d.]+)\s*\)\s*$/iu', $trimmed, $m)) {
                $prefix = trim($m[1]);
                $discVal = (float) str_replace('.', '', $m[2]);
                $hasBundleLines = true;

                // Strip leading tag e.g. [Item 1], [Slot 1], [Item Gratis], [Item Opsional]
                $cleanPrefix = preg_replace('/^\[[^\]]+\]\s*/u', '', $prefix);
                $slotQty = 1;
                if (preg_match('/^(?:1x\s+)*(\d+)x\s+(.*)$/iu', (string) $cleanPrefix, $qm)) {
                    $slotQty = max(1, (int) $qm[1]);
                    $restName = trim($qm[2]);
                } else {
                    $restName = trim((string) $cleanPrefix);
                }

                $varLabel = null;
                if (preg_match('/^(.*?)\s+-\s+Variasi:\s*(.+)$/iu', $restName, $vm)) {
                    $prodName = trim($vm[1]);
                    $varLabel = trim($vm[2]);
                } else {
                    $prodName = $restName;
                }

                $lineNorm = $discVal;
                if ($prodName !== '') {
                    $candProd = Product::with('variants')->where('name', $prodName)->first();
                    if ($candProd) {
                        $matchedVar = $varLabel
                            ? ($candProd->variants->first(fn ($v) => strtolower(trim((string) $v->label)) === strtolower($varLabel)) ?? $candProd->variants->first())
                            : $candProd->variants->first();

                        $vBase = (float) ($matchedVar?->price ?? $candProd->min_price ?? 0);
                        $vOrig = (float) (($matchedVar?->original_price ?? 0) > $vBase ? $matchedVar->original_price : $vBase);
                        $unitNorm = max($vOrig, $vBase);
                        $lineNorm = max($unitNorm * $slotQty, $discVal);
                    }
                }

                $sumNormal += $lineNorm;

                if ($lineNorm > $discVal) {
                    $normFmt = 'Rp ' . number_format($lineNorm, 0, ',', '.');
                    $discFmt = 'Rp ' . number_format($discVal, 0, ',', '.');
                    $enrichedLines[] = "{$prefix} ({$normFmt} -> {$discFmt})";
                } else {
                    $enrichedLines[] = $trimmed;
                }

                continue;
            }

            $enrichedLines[] = $trimmed;
        }

        $unitNormalPrice = ($hasBundleLines && $sumNormal > $unitDiscountPrice)
            ? $sumNormal
            : max((float) ($variantOriginalPrice ?? 0), $unitDiscountPrice);

        return [
            'custom_notes' => implode("\n", $enrichedLines),
            'original_price' => $unitNormalPrice,
            'price' => $unitDiscountPrice,
            'original_subtotal' => $unitNormalPrice * $qty,
            'subtotal' => $unitDiscountPrice * $qty,
        ];
    }

    /**
     * Resolve bundle pricing for this OrderItem instance.
     *
     * @return array{custom_notes: ?string, original_price: float, price: float, original_subtotal: float, subtotal: float}
     */
    public function resolveBundlePricing(): array
    {
        return self::enrichCustomNotesAndPricing(
            $this->custom_notes,
            (float) $this->price,
            (int) $this->quantity,
            $this->variant?->original_price ? (float) $this->variant->original_price : null
        );
    }
}


