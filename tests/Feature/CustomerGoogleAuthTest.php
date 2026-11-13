<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;

test('google redirect shows friendly warning when credentials are empty', function () {
    config()->set('services.google.client_id', null);
    config()->set('services.google.client_secret', null);

    $response = $this->get('/auth/google/redirect');

    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status');
});

test('google redirect redirects to google oauth provider when credentials exist', function () {
    config()->set('services.google.client_id', 'dummy-client-id');
    config()->set('services.google.client_secret', 'dummy-client-secret');

    $response = $this->get('/auth/google/redirect');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('accounts.google.com');
});

test('google callback logs in existing user by google_id', function () {
    $existing = User::factory()->create([
        'email' => 'member@example.com',
        'google_id' => 'google-uid-12345',
        'name' => 'Existing Customer',
    ]);

    $abstractUser = Mockery::mock(SocialiteUser::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-uid-12345');
    $abstractUser->shouldReceive('getEmail')->andReturn('member@example.com');
    $abstractUser->shouldReceive('getName')->andReturn('Existing Customer');
    $abstractUser->shouldReceive('getNickname')->andReturn('existing');
    $abstractUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/avatar.jpg');

    $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(route('home'));
    expect(Auth::check())->toBeTrue();
    expect(Auth::id())->toBe($existing->id);
});

test('google callback links existing email user and authenticates', function () {
    $existing = User::factory()->create([
        'email' => 'coffee.lover@example.com',
        'google_id' => null,
    ]);

    $abstractUser = Mockery::mock(SocialiteUser::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-uid-99999');
    $abstractUser->shouldReceive('getEmail')->andReturn('coffee.lover@example.com');
    $abstractUser->shouldReceive('getName')->andReturn('Coffee Lover');
    $abstractUser->shouldReceive('getNickname')->andReturn('coffeelover');
    $abstractUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/pic.jpg');

    $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(route('home'));
    expect(Auth::check())->toBeTrue();
    expect(Auth::id())->toBe($existing->id);
    expect($existing->fresh()->google_id)->toBe('google-uid-99999');
    expect($existing->fresh()->avatar)->toBe('https://lh3.googleusercontent.com/pic.jpg');
});

test('google callback registers new user and authenticates', function () {
    $abstractUser = Mockery::mock(SocialiteUser::class);
    $abstractUser->shouldReceive('getId')->andReturn('google-uid-newbie');
    $abstractUser->shouldReceive('getEmail')->andReturn('newbie@example.com');
    $abstractUser->shouldReceive('getName')->andReturn('Newbie Kopi');
    $abstractUser->shouldReceive('getNickname')->andReturn('newbie');
    $abstractUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/newbie.jpg');

    $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(route('home'));
    expect(Auth::check())->toBeTrue();
    $newUser = User::where('email', 'newbie@example.com')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->google_id)->toBe('google-uid-newbie');
    expect($newUser->avatar)->toBe('https://lh3.googleusercontent.com/newbie.jpg');
    expect($newUser->name)->toBe('Newbie Kopi');
});

