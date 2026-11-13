<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\HtmlString;

class ManageEditorialSection extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::BookOpen;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Jejak Rasa & Edukasi';

    protected static ?string $title = 'Pengaturan Jejak Rasa & Edukasi Seduh';

    protected static ?int $navigationSort = 7;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultEditorialItems = [
            [
                'badge' => null,
                'subBadge' => null,
                'title' => 'Mengenal Dirty Latte',
                'excerpt' => 'Kombinasi kontras double shot espresso hangat di atas susu dingin kental berlemak.',
                'cover_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'coverImage' => null,
                'href' => '/blog',
                'actionText' => 'Baca Artikel',
            ],
            [
                'badge' => 'PANDUAN SEDUH',
                'subBadge' => '2:45 menit',
                'title' => 'V60 Pour Over — Bersih, Terang & Manis',
                'excerpt' => 'Resep andalan tim Sanubari untuk mengeluarkan karakter floral dan fruity pada lini Filter Beans.',
                'cover_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'coverImage' => null,
                'href' => '/panduan-seduh',
                'actionText' => 'Lihat Panduan',
            ],
            [
                'badge' => null,
                'subBadge' => null,
                'title' => 'Menyusuri Jejak Kopi di Lereng Gunung Kawi',
                'excerpt' => 'Mengapa Gunung Kawi memiliki tanah vulkanis dan iklim mikro sempurna yang menghasilkan cita rasa manis alami.',
                'cover_url' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'coverImage' => null,
                'href' => '/blog',
                'actionText' => 'Baca Artikel',
            ],
            [
                'badge' => 'PANDUAN SEDUH',
                'subBadge' => '2:00 menit',
                'title' => 'AeroPress Inverted — Juicy',
                'excerpt' => 'Metode inverted menghadirkan ekstraksi yang intens dan body yang mantap dengan keasaman segar.',
                'cover_url' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=800&q=80',
                'coverImage' => null,
                'href' => '/panduan-seduh',
                'actionText' => 'Lihat Panduan',
            ],
        ];

        $rawItems = $settings['home_editorial_items'] ?? $defaultEditorialItems;
        $sanitizedItems = [];
        if (is_array($rawItems)) {
            foreach ($rawItems as $item) {
                $rawImg = $item['coverImage'] ?? ($item['cover_url'] ?? '');
                $diskPath = null;
                $externalUrl = null;

                if (! empty($rawImg)) {
                    if (str_starts_with($rawImg, 'http://') || str_starts_with($rawImg, 'https://')) {
                        $externalUrl = $rawImg;
                    } else {
                        $diskPath = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($rawImg)), '/');
                    }
                }

                $sanitizedItems[] = [
                    'badge' => $item['badge'] ?? '',
                    'subBadge' => $item['subBadge'] ?? '',
                    'actionText' => $item['actionText'] ?? 'Baca Artikel',
                    'title' => $item['title'] ?? '',
                    'href' => $item['href'] ?? '',
                    'coverImage' => $diskPath,
                    'cover_url' => $externalUrl,
                    'excerpt' => $item['excerpt'] ?? '',
                ];
            }
        }

        $this->form->fill([
            'home_editorial_badge' => $settings['home_editorial_badge'] ?? 'EDUKASI & CERITA',
            'home_editorial_title' => $settings['home_editorial_title'] ?? 'Jejak Rasa & Edukasi Seduh',
            'home_editorial_subtitle' => $settings['home_editorial_subtitle'] ?? 'Eksplorasi catatan roaster, cerita terroir Gunung Kawi, dan resep seduh presisi',
            'home_editorial_view_all_text' => $settings['home_editorial_view_all_text'] ?? 'Lihat Semua',
            'home_editorial_view_all_url' => $settings['home_editorial_view_all_url'] ?? '/blog',
            'home_editorial_source' => $settings['home_editorial_source'] ?? 'manual',
            'home_editorial_items' => $sanitizedItems,

            'home_koleksi_title' => $settings['home_koleksi_title'] ?? 'Koleksi Terbaru',
            'home_koleksi_subtitle' => $settings['home_koleksi_subtitle'] ?? 'Pilihan single origin dan houseblend siap kirim dengan jaminan tanggal sangrai baru',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make($this->getFormActions())
                            ->key('form-actions'),
                    ]),
            ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Postingan: Jejak Rasa & Edukasi Seduh')
                    ->description('Slider majalah editorial di beranda yang menampilkan artikel cerita, catatan roaster, dan panduan seduh.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_editorial_badge')
                                ->label('Badge Bagian Atas')
                                ->default('EDUKASI & CERITA')
                                ->required(),
                            TextInput::make('home_editorial_title')
                                ->label('Judul Bagian')
                                ->default('Jejak Rasa & Edukasi Seduh')
                                ->required(),
                        ]),
                        Textarea::make('home_editorial_subtitle')
                            ->label('Subjudul / Deskripsi')
                            ->rows(2)
                            ->default('Eksplorasi catatan roaster, cerita terroir Gunung Kawi, dan resep seduh presisi')
                            ->required(),
                        Grid::make(3)->schema([
                            TextInput::make('home_editorial_view_all_text')
                                ->label('Teks Tombol Lihat Semua')
                                ->default('Lihat Semua')
                                ->required(),
                            TextInput::make('home_editorial_view_all_url')
                                ->label('Tautan Tombol Lihat Semua')
                                ->default('/blog')
                                ->required(),
                            Select::make('home_editorial_source')
                                ->label('Sumber Konten Kartu')
                                ->options([
                                    'manual' => 'Kustom / Manual (Gunakan daftar kartu di bawah)',
                                    'auto' => 'Otomatis (Tarik dari Blog & Panduan Seduh Terbaru)',
                                ])
                                ->default('manual')
                                ->required(),
                        ]),
                        Repeater::make('home_editorial_items')
                            ->label('Daftar Kartu Jejak Rasa & Edukasi Seduh')
                            ->itemLabel(function (array $state): ?string {
                                $title = ! empty($state['title']) ? $state['title'] : 'Kartu Edukasi';
                                $hasImg = ! empty($state['coverImage']) || ! empty($state['cover_url']);
                                return $title . ($hasImg ? ' • 📸 Foto Siap' : ' • ⚠️ Belum Ada Foto');
                            })
                            ->schema([
                                Placeholder::make('editorial_preview')
                                    ->label('Pratinjau Foto Kartu Saat Ini')
                                    ->content(function ($get): HtmlString {
                                        $upload = $get('coverImage');
                                        $url = $get('cover_url');

                                        $src = null;
                                        if (! empty($upload)) {
                                            $path = is_array($upload) ? array_values($upload)[0] : $upload;
                                            if (! empty($path)) {
                                                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                                                    $src = $path;
                                                } else {
                                                    $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                                    $src = '/storage/' . $clean;
                                                }
                                            }
                                        }
                                        if (! $src && ! empty($url)) {
                                            $src = $url;
                                        }

                                        if (! $src) {
                                            return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-3 text-center text-xs text-gray-400">Belum ada foto yang dipilih. Silakan unggah foto atau masukkan URL foto di bawah.</div>');
                                        }

                                        $fallbackAttr = '';
                                        if (str_starts_with($src, '/storage/')) {
                                            $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                            $fallbackAttr = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                        }

                                        return new HtmlString(
                                            '<div class="flex items-center gap-4 rounded-xl border border-gray-700/60 bg-gray-900/60 p-3 shadow-inner my-1">' .
                                                '<div class="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-black/40">' .
                                                    '<img src="' . e($src) . '" alt="Pratinjau Foto Edukasi" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"' . $fallbackAttr . ' />' .
                                                '</div>' .
                                                '<div class="flex flex-col gap-1.5 text-xs text-gray-300 min-w-0">' .
                                                    '<div class="flex items-center gap-2 flex-wrap">' .
                                                        '<span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">Foto Terpasang</span>' .
                                                        '<span class="text-gray-400 font-mono text-[11px] truncate max-w-sm">' . e(basename($src)) . '</span>' .
                                                    '</div>' .
                                                    '<div class="text-[11px] text-gray-400 break-all">' . e($src) . '</div>' .
                                                    '<div class="pt-1">' .
                                                        '<a href="' . e($src) . '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 underline">' .
                                                            'Buka Ukuran Penuh ↗' .
                                                        '</a>' .
                                                    '</div>' .
                                                '</div>' .
                                            '</div>'
                                        );
                                    })
                                    ->columnSpanFull(),

                                Grid::make(3)->schema([
                                    TextInput::make('badge')
                                        ->label('Badge Utama (Kiri Atas - Opsional)')
                                        ->placeholder('Contoh: PANDUAN SEDUH (kosongkan jika tidak perlu)'),
                                    TextInput::make('subBadge')
                                        ->label('Sub-Badge (Kanan Atas - Opsional)')
                                        ->placeholder('2:45 menit'),
                                    TextInput::make('actionText')
                                        ->label('Teks Tombol Aksi')
                                        ->placeholder('Baca Artikel atau Lihat Panduan')
                                        ->default('Baca Artikel')
                                        ->required(),
                                ]),
                                Grid::make(2)->schema([
                                    TextInput::make('title')
                                        ->label('Judul Kartu')
                                        ->required(),
                                    TextInput::make('href')
                                        ->label('Tautan Halaman (URL)')
                                        ->placeholder('/blog atau /panduan-seduh')
                                        ->required(),
                                ]),
                                Grid::make(2)->schema([
                                    FileUpload::make('coverImage')
                                        ->label('Unggah Foto Kartu')
                                        ->disk('public')
                                        ->directory('editorial')
                                        ->image()
                                        ->imageEditor()
                                        ->live()
                                        ->maxSize(5120),
                                    TextInput::make('cover_url')
                                        ->label('Atau URL Gambar Eksternal')
                                        ->placeholder('https://images.unsplash.com/...')
                                        ->live(onBlur: true),
                                ]),
                                Textarea::make('excerpt')
                                    ->label('Ringkasan / Deskripsi Konten')
                                    ->rows(2),
                            ])
                            ->defaultItems(4)
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                Section::make('Koleksi Terbaru & Filter Chip')
                    ->description('Bagian etalase produk dengan filter chip interaktif (Semua, Kawi, Filter, Espresso, CO-Ferment).')
                    ->schema([
                        TextInput::make('home_koleksi_title')
                            ->label('Judul Koleksi Terbaru')
                            ->default('Koleksi Terbaru')
                            ->required(),
                        Textarea::make('home_koleksi_subtitle')
                            ->label('Subjudul Koleksi Terbaru')
                            ->rows(2)
                            ->default('Pilihan single origin dan houseblend siap kirim dengan jaminan tanggal sangrai baru')
                            ->required(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_editorial_items']) && is_array($data['home_editorial_items'])) {
            $processedItems = [];
            foreach ($data['home_editorial_items'] as $item) {
                $upload = $item['coverImage'] ?? null;
                $url = $item['cover_url'] ?? null;
                $finalCover = null;

                if (! empty($upload)) {
                    $uploadPath = is_array($upload) ? array_values($upload)[0] : $upload;
                    if (! empty($uploadPath)) {
                        $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($uploadPath)), '/');
                        $finalCover = '/storage/' . $clean;
                    }
                } elseif (! empty($url)) {
                    $finalCover = $url;
                }

                $processedItems[] = [
                    'badge' => $item['badge'] ?? '',
                    'subBadge' => $item['subBadge'] ?? '',
                    'actionText' => $item['actionText'] ?? 'Baca Artikel',
                    'title' => $item['title'] ?? '',
                    'href' => $item['href'] ?? '',
                    'coverImage' => $finalCover,
                    'cover_url' => $url,
                    'excerpt' => $item['excerpt'] ?? '',
                ];
            }
            $data['home_editorial_items'] = $processedItems;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Jejak Rasa & Edukasi Berhasil Disimpan!')
            ->body('Seluruh judul, badge, tautan, dan daftar kartu edukasi seduh telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Jejak Rasa & Edukasi')
                ->submit('save'),
        ];
    }
}
