<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('article')->index(); // article, guide, event
            $table->json('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Journal')->nullable();
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->json('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('author_name')->default('Sanubari Roastery');
            $table->integer('read_time_minutes')->default(3);
            $table->timestamp('published_at')->nullable();
            $table->integer('sort_order')->default(0);

            // Guide specific fields (for type='guide')
            $table->string('method')->nullable(); // V60, Aeropress, French Press, Tubruk, Espresso, Cold Brew
            $table->string('difficulty')->default('Easy')->nullable(); // Easy, Intermediate, Advanced
            $table->string('brew_time')->default('3:00 min')->nullable();
            $table->string('ratio')->default('1:15')->nullable();
            $table->string('grind_size')->default('Medium')->nullable();
            $table->string('water_temp')->default('92°C')->nullable();
            $table->json('steps')->nullable(); // array of [{step: 1, time: "0:00", text: "...", water_amount: "50g"}]

            // Event specific fields (for type='event')
            $table->string('location')->nullable();
            $table->string('address')->nullable();
            $table->decimal('fee', 12, 2)->default(0);
            $table->integer('capacity')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->string('status')->default('open'); // open, full, completed
            $table->string('whatsapp_register_text')->nullable();

            // Custom metadata / flexible fields
            $table->json('meta')->nullable();
            $table->json('layup_content')->nullable();

            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('posts');
    }
};
