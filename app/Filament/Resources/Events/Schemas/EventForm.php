<?php

namespace App\Filament\Resources\Events\Schemas;

use App\Models\Event;
use App\Models\Post;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class EventForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // SECTION 1: INFORMASI UTAMA ACARA
                Section::make('Informasi Utama Acara & Workshop')
                    ->description('Masukkan judul kegiatan, URL slug, kategori, dan deskripsi acara.')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.id')
                                ->label('Nama / Judul Acara')
                                ->placeholder('Contoh: Public Cupping: Menjelajah Micro-lot Gunung Kawi')
                                ->required()
                                ->columnSpan(2)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (string $operation, $state, callable $set, $get) {
                                    if ($operation === 'create' || empty($get('slug'))) {
                                        $set('slug', Str::slug((string) $state));
                                    }
                                }),
                            TextInput::make('slug')
                                ->label('Slug URL')
                                ->placeholder('public-cupping-kawi')
                                ->required()
                                ->unique(Post::class, 'slug', ignoreRecord: true)
                                ->helperText('Pengenal unik URL acara')
                                ->columnSpan(1),
                        ]),

                        Grid::make(3)->schema([
                            Select::make('category')
                                ->label('Kategori Acara')
                                ->options([
                                    'Live Music' => '🎵 Live Music & Akustik (Tanpa Daftar)',
                                    'Live DJ' => '🎧 Live DJ Session (Tanpa Daftar)',
                                    'Stand Alat Kopi Malang' => '☕ Stand / Pop-up Booth Alat Kopi Malang (Tanpa Daftar)',
                                    'Cupping Session' => '☕ Cupping Session (Uji Cita Rasa)',
                                    'Workshop Seduh' => '🧪 Workshop Seduh (Manual Brew)',
                                    'Roasting Masterclass' => '🔥 Roasting Masterclass',
                                    'Barista Class' => '🎓 Barista Class',
                                    'Sharing & Talkshow' => '🎙️ Sharing & Talkshow Kopi',
                                    'Komunitas' => '👥 Temu Komunitas & Jamming',
                                    'Special Event' => '✨ Special Event / Peluncuran',
                                ])
                                ->default('Cupping Session')
                                ->searchable()
                                ->live()
                                ->afterStateUpdated(function ($state, callable $set) {
                                    if (in_array($state, ['Live Music', 'Live DJ', 'Stand Alat Kopi Malang'])) {
                                        $set('meta.entry_type', 'walk_in');
                                        $set('fee', 0);
                                        if ($state === 'Stand Alat Kopi Malang') {
                                            $set('meta.walk_in_badge', 'Kunjungi Stand Kami');
                                        } else {
                                            $set('meta.walk_in_badge', 'Bebas Masuk • Langsung Datang');
                                        }
                                    }
                                })
                                ->required(),

                            Select::make('meta.entry_type')
                                ->label('Sistem Masuk / Registrasi')
                                ->options([
                                    'rsvp' => 'Wajib Daftar (RSVP via WhatsApp)',
                                    'walk_in' => 'Tanpa Daftar (Langsung Datang / Walk-In)',
                                ])
                                ->default('rsvp')
                                ->live()
                                ->helperText('Pilih "Tanpa Daftar" untuk Live Music, DJ, atau Stand Booth.'),

                            Select::make('status')
                                ->label('Status Acara')
                                ->options([
                                    'open' => 'Tersedia / Terjadwal (Open)',
                                    'full' => 'Kuota Penuh (Khusus RSVP)',
                                    'completed' => 'Selesai (Completed)',
                                ])
                                ->default('open')
                                ->required(),
                        ]),

                        Grid::make(3)
                            ->visible(fn ($get) => $get('meta.entry_type') === 'walk_in' || in_array($get('category'), ['Live Music', 'Live DJ', 'Stand Alat Kopi Malang']))
                            ->schema([
                                TextInput::make('meta.walk_in_badge')
                                    ->label('Label Badge Tanpa Daftar')
                                    ->placeholder('Contoh: Bebas Masuk • Langsung Datang')
                                    ->default('Bebas Masuk • Langsung Datang')
                                    ->helperText('Teks badge khusus yang tampil di kartu acara.'),

                                TextInput::make('meta.action_button_text')
                                    ->label('Teks Tombol Aksi Utama')
                                    ->placeholder('Contoh: Buka Petunjuk Arah')
                                    ->default('Buka Petunjuk Arah')
                                    ->helperText('Label tombol utama pada kartu acara.'),

                                TextInput::make('meta.maps_url')
                                    ->label('Tautan Google Maps Lokasi (Opsional)')
                                    ->placeholder('https://maps.app.goo.gl/...')
                                    ->helperText('Jika diisi, pengunjung langsung diarahkan ke peta lokasi venue.'),
                            ]),

                        Textarea::make('description.id')
                            ->label('Deskripsi Lengkap Acara (Bahasa Indonesia)')
                            ->rows(4)
                            ->required()
                            ->placeholder('Jelaskan detail kegiatan, materi yang dipelajari, siapa yang mendampingi, dan manfaat yang didapatkan peserta...')
                            ->columnSpanFull(),

                        Grid::make(2)->schema([
                            TextInput::make('title.en')
                                ->label('Judul Acara (English - Opsional)')
                                ->placeholder('e.g. Public Cupping: Exploring Mount Kawi Micro-lots'),
                            Textarea::make('description.en')
                                ->label('Deskripsi Acara (English - Opsional)')
                                ->rows(2)
                                ->placeholder('e.g. Open cupping session tasting 8 fresh varietals...'),
                        ]),
                    ]),

                // SECTION 2: WAKTU & JADWAL PELAKSANAAN
                Section::make('Jadwal & Waktu Pelaksanaan')
                    ->description('Tentukan tanggal dan jam pelaksanaan acara.')
                    ->schema([
                        Grid::make(2)->schema([
                            DateTimePicker::make('starts_at')
                                ->label('Waktu Mulai Acara')
                                ->required()
                                ->seconds(false)
                                ->default(now()->addDays(7)->setTime(15, 0))
                                ->helperText('Tanggal dan jam dimulainya sesi acara.'),
                            DateTimePicker::make('ends_at')
                                ->label('Waktu Selesai Acara (Opsional)')
                                ->seconds(false)
                                ->default(now()->addDays(7)->setTime(17, 30))
                                ->helperText('Tanggal dan jam perkiraan acara berakhir.'),
                        ]),
                    ]),

                // SECTION 3: LOKASI ACARA
                Section::make('Lokasi & Tempat Acara')
                    ->description('Informasi tempat diselenggarakannya acara.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('location')
                                ->label('Nama Tempat / Venue')
                                ->placeholder('Alat Kopi Malang Lab x Alat Kopi Malang')
                                ->default('Alat Kopi Malang Lab x Alat Kopi Malang')
                                ->required(),
                            TextInput::make('address')
                                ->label('Alamat Lengkap Venue')
                                ->placeholder('Jl. Terusan Kawi No. 12, Klojen, Kota Malang')
                                ->default('Jl. Terusan Kawi No. 12, Klojen, Malang'),
                        ]),
                    ]),

                // SECTION 4: TIKET, BIAYA & KUOTA
                Section::make('Biaya Pendaftaran & Kuota Peserta')
                    ->description('Tentukan harga tiket (HTM) dan kapasitas peserta yang tersedia.')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('fee')
                                ->label('Biaya Masuk / HTM')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(0)
                                ->required()
                                ->helperText('Ketik 0 jika acara Gratis / Free Entry / Tanpa Biaya.'),
                            TextInput::make('capacity')
                                ->label('Kapasitas Kuota (Orang)')
                                ->numeric()
                                ->placeholder('Contoh: 16 (Kosongkan jika terbuka/bebas)')
                                ->helperText('Kosongkan untuk acara tanpa batasan kuota (Walk-In).'),
                            TextInput::make('sort_order')
                                ->label('Urutan Prioritas')
                                ->numeric()
                                ->default(0)
                                ->helperText('0 = urutan standar'),
                        ]),
                    ]),

                // SECTION 5: FOTO SAMPUL / POSTER
                Section::make('Foto Sampul / Poster Acara')
                    ->description('Unggah poster atau foto kegiatan untuk ditampilkan pada kartu acara di halaman /acara.')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->label('Unggah Foto Poster / Sampul')
                            ->disk('public')
                            ->directory('events')
                            ->image()
                            ->imageEditor()
                            ->helperText('Format JPG/PNG/WebP. Disarankan rasio 16:9 atau 4:3.'),
                        TextInput::make('cover_image_url')
                            ->label('Atau Gunakan URL Gambar Eksternal')
                            ->placeholder('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80')
                            ->helperText('Opsi alternatif jika menggunakan link gambar eksternal yang sudah online.'),
                    ]),

                // SECTION 6: RESERVASI / KONTAK WHATSAPP
                Section::make('Kontak & Tanya Jawab WhatsApp')
                    ->description('Sesuaikan pesan otomatis saat pengunjung ingin mendaftar atau bertanya informasi acara via WhatsApp.')
                    ->schema([
                        TextInput::make('whatsapp_register_text')
                            ->label('Template Pesan WhatsApp')
                            ->placeholder('Halo Alat Kopi Malang! Saya ingin info seputar acara ini...')
                            ->helperText('Pesan ini otomatis muncul di kolom chat WhatsApp calon pengunjung saat mengklik tombol.')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}

