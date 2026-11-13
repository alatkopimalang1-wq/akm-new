<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Finder\Finder;

class GenerateWebpImages extends Command
{
    protected $signature = 'images:generate-webp {--force : Overwrite existing webp files} {--quality=82 : WebP quality 1-100}';

    protected $description = 'Generate WebP versions for all JPG and PNG images in storage/app/public';

    public function handle(): int
    {
        ini_set('memory_limit', '512M');

        $directory = storage_path('app/public');
        if (!is_dir($directory)) {
            $this->error("Directory not found: {$directory}");
            return Command::FAILURE;
        }

        $force = (bool) $this->option('force');
        $quality = (int) $this->option('quality');
        if ($quality < 10 || $quality > 100) {
            $quality = 82;
        }

        $finder = new Finder();
        $finder->files()
            ->in($directory)
            ->name('/\.(jpe?g|png)$/i');

        $totalOriginalBytes = 0;
        $totalWebpBytes = 0;
        $processedCount = 0;
        $skippedCount = 0;
        $errorCount = 0;

        $this->info("Scanning images in {$directory} (Quality: {$quality})...");

        foreach ($finder as $file) {
            $sourcePath = $file->getRealPath();
            $webpPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $sourcePath);

            if (!$force && file_exists($webpPath) && filemtime($webpPath) >= filemtime($sourcePath)) {
                $skippedCount++;
                continue;
            }

            $originalSize = filesize($sourcePath);

            try {
                $converted = $this->convertToWebp($sourcePath, $webpPath, $quality);
                if ($converted && file_exists($webpPath)) {
                    $webpSize = filesize($webpPath);
                    $totalOriginalBytes += $originalSize;
                    $totalWebpBytes += $webpSize;
                    $processedCount++;
                } else {
                    $errorCount++;
                }
            } catch (\Throwable $e) {
                $errorCount++;
                $this->warn("Failed converting {$file->getRelativePathname()}: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("WebP Generation Complete!");
        $this->table(
            ['Metric', 'Value'],
            [
                ['Processed Images', $processedCount],
                ['Skipped (Up to date)', $skippedCount],
                ['Errors', $errorCount],
                ['Original Size', $this->formatBytes($totalOriginalBytes)],
                ['WebP Size', $this->formatBytes($totalWebpBytes)],
                ['Bytes Saved', $this->formatBytes(max(0, $totalOriginalBytes - $totalWebpBytes))],
                ['Reduction', $totalOriginalBytes > 0 ? round((1 - ($totalWebpBytes / $totalOriginalBytes)) * 100, 1) . '%' : '0%'],
            ]
        );

        return Command::SUCCESS;
    }

    private function convertToWebp(string $source, string $destination, int $quality): bool
    {
        $info = @getimagesize($source);
        if (!$info) {
            return false;
        }

        $image = null;
        switch ($info['mime']) {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($source);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($source);
                if ($image) {
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                }
                break;
            default:
                return false;
        }

        if (!$image) {
            return false;
        }

        $result = @imagewebp($image, $destination, $quality);
        imagedestroy($image);

        return $result;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }
}

