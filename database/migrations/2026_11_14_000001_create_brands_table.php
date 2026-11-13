<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('brands')) {
            Schema::create('brands', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->string('origin')->nullable();
                $table->string('logo')->nullable();
                $table->text('description')->nullable();
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // Seed existing brands from products table if any
        if (Schema::hasTable('products')) {
            $existingProducts = DB::table('products')
                ->whereNotNull('producer')
                ->where('producer', '!=', '')
                ->select('producer', 'origin')
                ->get();

            $sort = 1;
            foreach ($existingProducts as $row) {
                $name = trim((string) $row->producer);
                if ($name === '') {
                    continue;
                }
                $slug = Str::slug($name);
                if ($slug === '') {
                    continue;
                }

                $exists = DB::table('brands')
                    ->where('name', $name)
                    ->orWhere('slug', $slug)
                    ->exists();

                if (! $exists) {
                    DB::table('brands')->insert([
                        'name' => $name,
                        'slug' => $slug,
                        'origin' => $row->origin ?: null,
                        'is_active' => true,
                        'sort_order' => $sort++,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
