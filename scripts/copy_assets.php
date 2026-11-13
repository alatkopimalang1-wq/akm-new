<?php

$root = dirname(__DIR__);
$target = $root . '/resources/seed-assets';

@mkdir($target . '/banners', 0755, true);
@mkdir($target . '/featured-menu', 0755, true);
@mkdir($target . '/taste-recommendations', 0755, true);
@mkdir($target . '/mega-menu', 0755, true);
@mkdir($target . '/products/variants', 0755, true);

// Banners
foreach (['slide-1.jpg', 'slide-2.jpg', 'slide-3.jpg', 'slide-4.jpg'] as $f) {
    $src = $root . '/storage/app/public/banners/' . $f;
    if (file_exists($src)) {
        copy($src, $target . '/banners/' . $f);
        echo "Banner: $f\n";
    }
}

// Featured Menu
foreach (['laris-1.jpg', 'laris-2.jpg', 'laris-3.jpg'] as $f) {
    $src = $root . '/storage/app/public/featured-menu/' . $f;
    if (file_exists($src)) {
        copy($src, $target . '/featured-menu/' . $f);
        echo "Featured: $f\n";
    }
}

// Mega Menu
foreach (['roast-fresh.jpg', 'wholesale.jpg', 'showroom.jpg'] as $f) {
    $src = $root . '/storage/app/public/mega-menu/' . $f;
    if (file_exists($src)) {
        copy($src, $target . '/mega-menu/' . $f);
        echo "Mega: $f\n";
    }
}

// Taste Recommendations
$tasteUrls = [
    'taste-1.jpg' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
    'taste-2.jpg' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    'taste-3.jpg' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
    'taste-4.jpg' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    'taste-5.jpg' => 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    'taste-6.jpg' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
];

$laris1 = $target . '/featured-menu/laris-1.jpg';
foreach ($tasteUrls as $file => $url) {
    $dest = $target . '/taste-recommendations/' . $file;
    if (!file_exists($dest)) {
        $ctx = stream_context_create([
            'http' => ['timeout' => 5, 'header' => "User-Agent: Mozilla/5.0\r\n"],
            'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
        ]);
        $content = @file_get_contents($url, false, $ctx);
        if ($content) {
            file_put_contents($dest, $content);
            echo "Taste: $file\n";
        } elseif (file_exists($laris1)) {
            copy($laris1, $dest);
            echo "Fallback taste: $file\n";
        }
    } else {
        echo "Exists taste: $file\n";
    }
}

// Product Variants Packaging Images
$variantUrls = [
    'variant-15g.jpg' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    'variant-100g.jpg' => 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
    'variant-200g.jpg' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
];

foreach ($variantUrls as $file => $url) {
    $dest = $target . '/products/variants/' . $file;
    if (!file_exists($dest)) {
        $ctx = stream_context_create([
            'http' => ['timeout' => 5, 'header' => "User-Agent: Mozilla/5.0\r\n"],
            'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
        ]);
        $content = @file_get_contents($url, false, $ctx);
        if ($content) {
            file_put_contents($dest, $content);
            echo "Variant: $file\n";
        } elseif (file_exists($laris1)) {
            copy($laris1, $dest);
            echo "Fallback variant: $file\n";
        }
    } else {
        echo "Exists variant: $file\n";
    }
}

echo "All seed assets ready in $target\n";
