<?php

namespace App\Models\Concerns;

trait HasTranslations
{
    /**
     * Get a translated attribute value based on the current locale.
     */
    public function getTranslation(string $attribute, ?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();
        $value = $this->getAttribute($attribute);

        if (is_string($value)) {
            // Check if it is a JSON string
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            } else {
                return $value;
            }
        }

        if (is_array($value)) {
            return $value[$locale] ?? $value['id'] ?? $value['en'] ?? reset($value) ?? null;
        }

        return $value;
    }
}
