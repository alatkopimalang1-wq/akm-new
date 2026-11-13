<?php

namespace App\Filament\Resources\Settings;

use App\Filament\Resources\Settings\Pages\CreateSetting;
use App\Filament\Resources\Settings\Pages\EditSetting;
use App\Filament\Resources\Settings\Pages\ListSettings;
use App\Models\Setting;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SettingResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::Cog6Tooth;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan Toko';

    protected static ?string $navigationLabel = 'Konfigurasi Toko & WhatsApp';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Parameter Pengaturan')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('key')
                            ->label('Kunci Pengaturan (Key)')
                            ->required()
                            ->unique(Setting::class, 'key', ignoreRecord: true)
                            ->placeholder('e.g. store_whatsapp, store_address, store_hours'),
                        Select::make('group')
                            ->label('Grup Pengaturan')
                            ->options([
                                'general' => 'Umum (General)',
                                'contact' => 'Kontak & WhatsApp',
                                'operational' => 'Operasional & Lokasi',
                            ])
                            ->default('general')
                            ->required(),
                    ]),
                    Textarea::make('value')
                        ->label('Nilai Pengaturan (Value)')
                        ->rows(4)
                        ->required()
                        ->placeholder('Isi nilai teks atau konfigurasi'),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')
                    ->label('Kunci (Key)')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('value')
                    ->label('Nilai (Value)')
                    ->limit(50)
                    ->searchable(),
                TextColumn::make('group')
                    ->label('Grup')
                    ->badge()
                    ->color('amber'),
                TextColumn::make('updated_at')
                    ->label('Terakhir Diperbarui')
                    ->dateTime(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSettings::route('/'),
            'create' => CreateSetting::route('/create'),
            'edit' => EditSetting::route('/{record}/edit'),
        ];
    }
}

