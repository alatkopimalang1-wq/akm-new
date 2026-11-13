<?php

use App\Models\User;
use Filament\Auth\Pages\EditProfile;
use Livewire\Livewire;
use Illuminate\Support\Facades\Hash;

test('admin can access filament profile page', function () {
    $admin = User::factory()->create([
        'email' => 'admin@sanubari.id',
    ]);

    $response = $this->actingAs($admin)->get('/admin/profile');
    $response->assertSuccessful();
});

test('admin can change password via filament profile page', function () {
    $admin = User::factory()->create([
        'password' => Hash::make('old-admin-password'),
    ]);

    $this->actingAs($admin);

    Livewire::test(EditProfile::class)
        ->fillForm([
            'name' => $admin->name,
            'email' => $admin->email,
            'currentPassword' => 'old-admin-password',
            'password' => 'new-secure-admin-pass123',
            'passwordConfirmation' => 'new-secure-admin-pass123',
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $admin->refresh();
    expect(Hash::check('new-secure-admin-pass123', $admin->password))->toBeTrue();
});

