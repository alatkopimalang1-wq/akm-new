<?php

namespace App\Filament\Resources\VideoReels\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VideoReelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Informasi Utama Video Reel')
                    ->description('Atur judul konten reels, deskripsi, dan label sorotan.')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('headline')
                            ->label('Judul Video Reel')
                            ->placeholder('Contoh: Kalo Mesin Espresso Diperkecil, Maka Jadi Segini..')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Textarea::make('caption')
                            ->label('Deskripsi / Caption Reels')
                            ->placeholder('Tuliskan ringkasan isi video reels atau tips seduh...')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('badge')
                                ->label('Badge Highlight (Opsional)')
                                ->placeholder('Contoh: BARISTA APPROVED! ☕🔥')
                                ->columnSpan(1),

                            Toggle::make('is_active')
                                ->label('Status Aktif')
                                ->helperText('Tampilkan reels ini di website publik')
                                ->default(true)
                                ->columnSpan(1),
                        ]),
                    ]),

                Section::make('Tautan Instagram Reels & Cover Thumbnail')
                    ->description('Masukkan URL Instagram Reels resmi dan unggah gambar cover thumbnail (rasio 9:16). Ketika pengunjung mengklik reels di website, mereka akan otomatis diarahkan ke aplikasi Instagram untuk menontonnya.')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('video_url')
                            ->label('URL Tautan Instagram Reels')
                            ->placeholder('Contoh: https://www.instagram.com/reel/C-XYZ123/ atau https://www.instagram.com/sanubari.roastery.mlg/')
                            ->helperText('Tautan video Instagram Reels. Pengunjung yang mengklik video akan langsung dibuka ke aplikasi Instagram.')
                            ->required()
                            ->url()
                            ->columnSpanFull(),

                        FileUpload::make('thumbnail_upload')
                            ->label('Upload Gambar Cover / Thumbnail')
                            ->helperText('Unggah gambar cover portrait (rasio vertikal 9:16, format JPG/PNG/WEBP, maks. 5MB).')
                            ->image()
                            ->imageEditor()
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('9:16')
                            ->maxSize(5120)
                            ->disk('public')
                            ->directory('reels/thumbnails')
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
