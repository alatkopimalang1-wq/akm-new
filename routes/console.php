<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment('Seduh kopi terbaik dengan alat presisi.');
})->purpose('Display an inspiring quote');

