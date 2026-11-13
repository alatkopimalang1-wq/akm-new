<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Pesanan & Status')
                    ->icon('heroicon-o-shopping-bag')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('order_number')
                                ->label('Nomor Pesanan')
                                ->disabled()
                                ->required(),
                            Select::make('payment_status')
                                ->label('Status Pembayaran')
                                ->options([
                                    'pending' => 'Menunggu Pembayaran',
                                    'verifying' => 'Menunggu Verifikasi',
                                    'paid' => 'Lunas / Berhasil',
                                    'cancelled' => 'Dibatalkan',
                                ])
                                ->required(),
                            Select::make('status')
                                ->label('Status Pesanan')
                                ->options([
                                    'pending' => 'Menunggu Konfirmasi',
                                    'processing' => 'Diproses Roaster',
                                    'ready_for_pickup' => 'Siap Diambil di Roastery (Pick Up)',
                                    'shipped' => 'Dalam Pengiriman Kurir',
                                    'completed' => 'Selesai (Terkirim / Sudah Diambil)',
                                    'cancelled' => 'Dibatalkan',
                                ])
                                ->required(),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('payment_method')
                                ->label('Metode Pembayaran')
                                ->disabled(),
                            TextInput::make('payment_channel')
                                ->label('Channel / Bank')
                                ->disabled(),
                            TextInput::make('total_amount')
                                ->label('Total Pembayaran (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->disabled(),
                        ]),
                    ]),

                Section::make('Data Pemesan & Pengiriman')
                    ->icon('heroicon-o-user')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('customer_name')
                                ->label('Nama Lengkap')
                                ->required(),
                            TextInput::make('customer_phone')
                                ->label('Nomor WhatsApp / HP')
                                ->required(),
                        ]),
                        Textarea::make('customer_address')
                            ->label('Alamat Pengiriman Lengkap')
                            ->rows(3)
                            ->required(),
                        Textarea::make('customer_notes')
                            ->label('Catatan Pesanan Pelanggan')
                            ->rows(2),
                    ]),

                Section::make('Ekspedisi & Pengiriman Kurir')
                    ->icon('heroicon-o-truck')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('shipping_courier')
                                ->label('Kurir Ekspedisi')
                                ->disabled(),
                            TextInput::make('shipping_service')
                                ->label('Layanan Pengiriman')
                                ->disabled(),
                            TextInput::make('shipping_etd')
                                ->label('Estimasi Pengiriman')
                                ->disabled(),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('shipping_cost')
                                ->label('Biaya Ongkir (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->disabled(),
                            TextInput::make('total_weight_grams')
                                ->label('Berat Paket (Gram)')
                                ->numeric()
                                ->suffix('g')
                                ->disabled(),
                            TextInput::make('tracking_number')
                                ->label('Nomor Resi Kurir (Airwaybill)')
                                ->placeholder('Contoh: JNE019283921 / JNT829102')
                                ->helperText('Masukkan no resi saat kopi telah diserahkan ke ekspedisi.'),
                        ]),
                    ]),

                Section::make('Bukti Pembayaran (Transfer Proof)')
                    ->icon('heroicon-o-document-check')
                    ->collapsible()
                    ->schema([
                        FileUpload::make('payment_proof')
                            ->label('File Bukti Pembayaran / Struk Transfer')
                            ->disk('public')
                            ->directory('payment-proofs')
                            ->image()
                            ->openable()
                            ->downloadable(),
                    ]),

                Section::make('Daftar Produk yang Dipesan')
                    ->icon('heroicon-o-list-bullet')
                    ->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->itemLabel(fn (array $state): ?string => ($state['product_name'] ?? 'Kopi') . (!empty($state['custom_notes']) ? " — [{$state['custom_notes']}]" : (!empty($state['variant_label']) ? " ({$state['variant_label']})" : '')))
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('product_name')
                                        ->label('Nama Kopi')
                                        ->disabled()
                                        ->columnSpan(2),
                                    TextInput::make('variant_label')
                                        ->label('Kemasan')
                                        ->disabled(),
                                    TextInput::make('grind_option')
                                        ->label('Gilingan')
                                        ->disabled(),
                                ]),
                                Textarea::make('custom_notes')
                                    ->label('Komposisi Biji Kopi & Rasio Blend (C.Y.B.R)')
                                    ->helperText('Racikan rasio dan nama blend kustom yang dipesan pelanggan.')
                                    ->rows(2)
                                    ->disabled()
                                    ->visible(fn ($state) => !empty($state))
                                    ->columnSpanFull(),
                                Grid::make(3)->schema([
                                    TextInput::make('price')
                                        ->label('Harga Satuan')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->disabled(),
                                    TextInput::make('quantity')
                                        ->label('Jumlah (Qty)')
                                        ->numeric()
                                        ->disabled(),
                                    TextInput::make('subtotal')
                                        ->label('Subtotal Item')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->disabled(),
                                ]),
                            ])
                            ->addable(false)
                            ->deletable(false)
                            ->columns(1),
                    ]),
            ]);
    }
}

