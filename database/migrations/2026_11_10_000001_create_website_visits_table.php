<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_visits', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_id', 64)->index();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('url', 255)->index();
            $table->string('route_name', 100)->nullable();
            $table->string('device', 20)->default('desktop')->index(); // desktop, mobile, tablet
            $table->string('browser', 50)->nullable();
            $table->string('platform', 50)->nullable();
            $table->string('referer', 255)->nullable();
            $table->timestamp('last_activity_at')->index();
            $table->timestamps();

            $table->index(['created_at', 'visitor_id']);
            $table->index(['last_activity_at', 'visitor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_visits');
    }
};
