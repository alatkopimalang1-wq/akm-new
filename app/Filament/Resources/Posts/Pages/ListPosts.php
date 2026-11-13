<?php

namespace App\Filament\Resources\Posts\Pages;

use App\Filament\Resources\Posts\PostResource;
use App\Models\Post;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;

class ListPosts extends ListRecords
{
    protected static string $resource = PostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Tulis Artikel Baru')
                ->icon(Heroicon::PlusCircle),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Semua Artikel')
                ->icon(Heroicon::DocumentText)
                ->badge(fn () => Post::articles()->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'article')),
            'published' => Tab::make('Diterbitkan')
                ->icon(Heroicon::CheckCircle)
                ->badge(fn () => Post::articles()->published()->count())
                ->badgeColor('success')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'article')->whereNotNull('published_at')->where('published_at', '<=', now())),
            'drafts' => Tab::make('Draf')
                ->icon(Heroicon::DocumentDuplicate)
                ->badge(fn () => Post::articles()->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '>', now()))->count())
                ->badgeColor('gray')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', 'article')->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '>', now()))),
            'other' => Tab::make('Panduan & Acara')
                ->icon(Heroicon::Folder)
                ->badge(fn () => Post::where('type', '!=', 'article')->count())
                ->modifyQueryUsing(fn (Builder $query) => $query->where('type', '!=', 'article')),
        ];
    }
}
