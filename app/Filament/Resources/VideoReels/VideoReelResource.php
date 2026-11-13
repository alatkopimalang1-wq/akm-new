<?php

namespace App\Filament\Resources\VideoReels;

use App\Filament\Resources\VideoReels\Pages\CreateVideoReel;
use App\Filament\Resources\VideoReels\Pages\EditVideoReel;
use App\Filament\Resources\VideoReels\Pages\ListVideoReels;
use App\Filament\Resources\VideoReels\Schemas\VideoReelForm;
use App\Filament\Resources\VideoReels\Tables\VideoReelsTable;
use App\Models\VideoReel;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class VideoReelResource extends Resource
{
    protected static ?string $model = VideoReel::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Film;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Video Reels';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return VideoReelForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VideoReelsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVideoReels::route('/'),
            'create' => CreateVideoReel::route('/create'),
            'edit' => EditVideoReel::route('/{record}/edit'),
        ];
    }
}

