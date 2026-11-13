<?php

namespace App\Filament\Resources\VideoReels\Pages;

use App\Filament\Resources\VideoReels\VideoReelResource;
use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;

class ListVideoReels extends ListRecords
{
    protected static string $resource = VideoReelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('settings')
                ->label('Pengaturan Judul & Deskripsi')
                ->icon(Heroicon::Cog6Tooth)
                ->color('gray')
                ->modalHeading('Pengaturan Judul & Deskripsi Bagian Video Reels')
                ->modalDescription('Atur judul dan deskripsi yang tampil pada header bagian Video Reels di halaman awal serta halaman /video.')
                ->modalSubmitActionLabel('Simpan Perubahan')
                ->fillForm(fn (): array => [
                    'home_reels_title' => Setting::get('home_reels_title', 'Sanubari Reels Videos'),
                    'home_reels_subtitle' => Setting::get('home_reels_subtitle', 'Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels'),
                    'home_reels_view_all_text' => Setting::get('home_reels_view_all_text', 'Lihat Semua'),
                    'home_reels_view_all_url' => Setting::get('home_reels_view_all_url', '/video'),
                ])
                ->form([
                    TextInput::make('home_reels_title')
                        ->label('Judul Bagian Video Reels')
                        ->required()
                        ->placeholder('Sanubari Reels Videos')
                        ->helperText('Judul tebal di samping ikon Instagram pada halaman awal.'),
                    Textarea::make('home_reels_subtitle')
                        ->label('Deskripsi / Subtitle Bagian')
                        ->rows(3)
                        ->required()
                        ->placeholder('Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels')
                        ->helperText('Teks penjelasan di bawah judul video reels.'),
                    TextInput::make('home_reels_view_all_text')
                        ->label('Teks Tombol Tautan (Lihat Semua)')
                        ->default('Lihat Semua')
                        ->required(),
                    TextInput::make('home_reels_view_all_url')
                        ->label('URL Tautan (Lihat Semua)')
                        ->default('/video')
                        ->required(),
                ])
                ->action(function (array $data): void {
                    Setting::set('home_reels_title', $data['home_reels_title']);
                    Setting::set('home_reels_subtitle', $data['home_reels_subtitle']);
                    Setting::set('home_reels_view_all_text', $data['home_reels_view_all_text'] ?? 'Lihat Semua');
                    Setting::set('home_reels_view_all_url', $data['home_reels_view_all_url'] ?? '/video');

                    Cache::forget('sanubari_settings');

                    Notification::make()
                        ->title('Judul & Deskripsi Video Reels Berhasil Disimpan!')
                        ->body('Perubahan judul dan deskripsi telah diterapkan ke halaman website.')
                        ->success()
                        ->send();
                }),

            CreateAction::make()
                ->label('Tambah Video Reel Baru'),
        ];
    }
}
