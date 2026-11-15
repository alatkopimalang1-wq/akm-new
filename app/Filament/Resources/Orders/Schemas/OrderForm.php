<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Order;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Informasi Status & Verifikasi Pesanan')
                    ->description('Kelola status penerimaan, proses roasting, dan status verifikasi pembayaran pesanan.')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('order_number')
                                ->label('Nomor Pesanan')
                                ->disabled()
                                ->dehydrated(false),

                            Select::make('status')
                                ->label('Status Operasional Pesanan')
                                ->options([
                                    'pending' => 'Menunggu Konfirmasi',
                                    'processing' => 'Sedang Diproses & Disangrai',
                                    'ready_for_pickup' => 'Siap Diambil di Roastery',
                                    'shipped' => 'Dalam Pengiriman Kurir',
                                    'completed' => 'Pesanan Selesai',
                                    'cancelled' => 'Pesanan Dibatalkan',
                                ])
                                ->required()
                                ->native(false),

                            Select::make('payment_status')
                                ->label('Status Pembayaran')
                                ->options([
                                    'pending' => 'Menunggu Pembayaran',
                                    'verifying' => 'Menunggu Verifikasi Bukti',
                                    'paid' => 'Pembayaran Berhasil / Lunas',
                                    'cancelled' => 'Dibatalkan',
                                ])
                                ->required()
                                ->native(false),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('payment_method')
                                ->label('Metode Pembayaran')
                                ->formatStateUsing(fn (Order $record): string => match ($record->payment_method) {
                                    'qris' => 'QRIS Resmi Toko',
                                    'bank_transfer' => 'Transfer Bank (' . strtoupper((string) ($record->payment_channel ?? 'BCA')) . ')',
                                    'whatsapp' => 'WhatsApp Order',
                                    default => ucfirst((string) $record->payment_method),
                                })
                                ->disabled()
                                ->dehydrated(false),

                            DateTimePicker::make('paid_at')
                                ->label('Waktu Pembayaran Diterima')
                                ->native(false),

                            TextInput::make('created_at')
                                ->label('Waktu Pesanan Masuk')
                                ->formatStateUsing(fn (Order $record): string => $record->created_at ? $record->created_at->format('d/m/Y H:i:s') . ' (' . $record->created_at->diffForHumans() . ')' : '-')
                                ->disabled()
                                ->dehydrated(false),
                        ]),

                        Placeholder::make('preorder_dp_summary')
                            ->label('Ringkasan Pembayaran DP (Down Payment) Pre-Order')
                            ->content(function (?Order $record): ?HtmlString {
                                if (! $record || empty($record->payment_details['is_preorder_dp'])) {
                                    return null;
                                }

                                $details = $record->payment_details;
                                $pct = (int) ($details['dp_percentage'] ?? 30);
                                $fullTotal = number_format((float) ($details['full_total_amount'] ?? 0), 0, ',', '.');
                                $dpPaid = number_format((float) ($record->total_amount ?? 0), 0, ',', '.');
                                $remaining = number_format((float) ($details['remaining_balance'] ?? 0), 0, ',', '.');
                                $poSub = number_format((float) ($details['preorder_subtotal'] ?? 0), 0, ',', '.');
                                $nonPoSub = number_format((float) ($details['non_preorder_subtotal'] ?? 0), 0, ',', '.');

                                return new HtmlString("
                                    <div class='p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-sm'>
                                        <div class='font-bold text-amber-500 flex items-center gap-2'>
                                            <span>⏳ Pesanan Menggunakan Skema DP Pre-Order {$pct}%</span>
                                        </div>
                                        <div class='grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1'>
                                            <div><span class='text-gray-400'>Total Pesanan Penuh:</span><br><b class='text-base text-gray-200'>Rp {$fullTotal}</b></div>
                                            <div><span class='text-gray-400'>Tagihan DP ({$pct}%) + Item Non-PO:</span><br><b class='text-base text-emerald-400'>Rp {$dpPaid}</b></div>
                                            <div><span class='text-gray-400'>Sisa Pelunasan Nanti:</span><br><b class='text-base text-rose-400'>Rp {$remaining}</b></div>
                                            <div><span class='text-gray-400'>Alokasi Subtotal:</span><br><span class='text-gray-300'>PO: Rp {$poSub} | Non-PO: Rp {$nonPoSub}</span></div>
                                        </div>
                                    </div>
                                ");
                            })
                            ->hidden(fn (?Order $record): bool => empty($record?->payment_details['is_preorder_dp'])),
                    ]),

                Section::make('Rincian Biaya & Bukti Transfer')
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('subtotal')
                                ->label('Subtotal Produk')
                                ->prefix('Rp')
                                ->numeric()
                                ->required(),

                            TextInput::make('shipping_cost')
                                ->label('Ongkos Kirim')
                                ->prefix('Rp')
                                ->numeric()
                                ->required(),

                            TextInput::make('unique_code')
                                ->label('Kode Unik')
                                ->numeric()
                                ->default(0),

                            TextInput::make('total_amount')
                                ->label('Total Akhir Tagihan')
                                ->prefix('Rp')
                                ->numeric()
                                ->required(),
                        ]),

                        FileUpload::make('payment_proof')
                            ->label('Foto / Screenshot Bukti Pembayaran')
                            ->disk('public')
                            ->directory('payment-proofs')
                            ->image()
                            ->imageEditor()
                            ->openable()
                            ->downloadable()
                            ->helperText('Pelanggan dapat mengunggah bukti transfer dari tautan instruksi pembayaran.'),
                    ]),

                Section::make('Data Pelanggan & Alamat Pengiriman')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('customer_name')
                                ->label('Nama Lengkap')
                                ->required(),

                            TextInput::make('customer_phone')
                                ->label('Nomor Telepon / WhatsApp')
                                ->tel()
                                ->required(),

                            TextInput::make('customer_email')
                                ->label('Email Pelanggan')
                                ->email(),
                        ]),

                        Textarea::make('customer_address')
                            ->label('Alamat Lengkap Pengiriman')
                            ->rows(3)
                            ->required(),

                        Grid::make(4)->schema([
                            TextInput::make('shipping_district')
                                ->label('Kecamatan'),

                            TextInput::make('shipping_city')
                                ->label('Kota / Kabupaten'),

                            TextInput::make('shipping_province')
                                ->label('Provinsi'),

                            TextInput::make('shipping_postal_code')
                                ->label('Kode Pos'),
                        ]),

                        Textarea::make('customer_notes')
                            ->label('Catatan dari Pelanggan')
                            ->rows(2)
                            ->placeholder('Contoh: Titipkan di satpam, jangan dibanting, dll.'),
                    ]),

                Section::make('Kurir & Resi Pengiriman')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('shipping_courier')
                                ->label('Nama Kurir / Opsi')
                                ->placeholder('Contoh: JNE / J&T / SiCepat / Ambil di Toko'),

                            TextInput::make('shipping_service')
                                ->label('Layanan Pengiriman')
                                ->placeholder('Contoh: REG / YES / Express'),

                            TextInput::make('tracking_number')
                                ->label('Nomor Resi Pengiriman')
                                ->placeholder('Masukkan No. Resi setelah paket diserahkan ke kurir'),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('shipping_etd')
                                ->label('Estimasi Pengiriman (ETD)')
                                ->placeholder('Contoh: 1-2 hari kerja'),

                            TextInput::make('total_weight_grams')
                                ->label('Total Berat Paket')
                                ->suffix('gram')
                                ->numeric()
                                ->default(200),
                        ]),
                    ]),

                Section::make('Daftar Produk yang Dipesan')
                    ->schema([
                        Repeater::make('items')
                            ->relationship('items')
                            ->schema([
                                Grid::make(6)->schema([
                                    TextInput::make('product_name')
                                        ->label('Nama Produk')
                                        ->disabled()
                                        ->columnSpan(2),

                                    TextInput::make('variant_label')
                                        ->label('Varian')
                                        ->disabled(),

                                    TextInput::make('grind_option')
                                        ->label('Gilingan')
                                        ->disabled(),

                                    TextInput::make('quantity')
                                        ->label('Qty')
                                        ->numeric()
                                        ->disabled(),

                                    TextInput::make('price')
                                        ->label('Harga')
                                        ->prefix('Rp')
                                        ->disabled(),

                                    TextInput::make('subtotal')
                                        ->label('Subtotal')
                                        ->prefix('Rp')
                                        ->disabled(),
                                ]),

                                Textarea::make('custom_notes')
                                    ->label('Catatan Khusus / Rincian Bundling')
                                    ->rows(3)
                                    ->disabled()
                                    ->columnSpanFull(),
                            ])
                            ->addable(false)
                            ->deletable(false)
                            ->reorderable(false)
                            ->collapsible(),
                    ]),
            ]);
    }
}
