<?php

namespace App\Filament\Concerns;

trait RedirectsToPreviousUrl
{
    protected function getRedirectUrl(): string
    {
        $previous = $this->previousUrl;
        $current = url()->current();
        $previousPath = parse_url((string) $previous, PHP_URL_PATH) ?? '';

        if (
            filled($previous) &&
            $previous !== $current &&
            ! str_ends_with($previousPath, '/edit') &&
            ! str_ends_with($previousPath, '/create') &&
            str_contains($previous, '/admin')
        ) {
            return $previous;
        }

        return $this->getResource()::getUrl('index');
    }
}
