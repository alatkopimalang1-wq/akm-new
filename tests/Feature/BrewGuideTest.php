<?php

use App\Models\BrewGuide;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('panduan seduh index page loads and displays resep seduh v60 pour over and japanese ice coffee with custom ratio and live timer', function () {
    $response = $this->get('/panduan-seduh');

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('brew-guide/index')
        ->has('guides')
        ->has('recommendedBeans')
    );
});

test('resep seduh v60 and japanese ice coffee alias route loads successfully', function () {
    $response = $this->get('/resep-seduh-v60-japanese-ice');

    $response->assertSuccessful();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('brew-guide/index')
    );
});

