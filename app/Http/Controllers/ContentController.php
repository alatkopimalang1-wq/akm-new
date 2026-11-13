<?php

namespace App\Http\Controllers;

use App\Models\BrewGuide;
use App\Models\Event;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use App\Models\VideoReel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('about', [
            'page' => Setting::get('page_about', []),
        ]);
    }

    public function wholesale(): Response
    {
        return Inertia::render('wholesale', [
            'page' => Setting::get('page_wholesale', []),
        ]);
    }

    public function roasting(): Response
    {
        return Inertia::render('roasting', [
            'page' => Setting::get('page_roasting', []),
        ]);
    }

    public function baristaTraining(): Response
    {
        return Inertia::render('barista-training', [
            'page' => Setting::get('page_barista_training', []),
        ]);
    }

    public function visit(): Response
    {
        return Inertia::render('visit', [
            'page' => Setting::get('page_visit', []),
        ]);
    }

    public function customVisit(string $slug): Response
    {
        $customPages = Setting::get('custom_visit_pages', []);
        $cleanSlug = trim(strtolower($slug), '/');

        $page = collect($customPages)->first(function ($item) use ($cleanSlug) {
            $itemSlug = trim(strtolower($item['slug'] ?? ''), '/');
            return $itemSlug === $cleanSlug && ($item['is_active'] ?? true);
        });

        if (! $page) {
            abort(404);
        }

        return Inertia::render('visit', [
            'page' => $page,
        ]);
    }

    public function brewGuides(): Response
    {
        $guides = BrewGuide::orderBy('sort_order')->get();
        $recommendedBeans = Product::active()
            ->with(['variants', 'images', 'categories'])
            ->take(4)
            ->get();
        $brewSettings = Setting::get('brew_guide_settings');

        return Inertia::render('brew-guide/index', [
            'guides' => $guides,
            'recommendedBeans' => $recommendedBeans,
            'brewSettings' => $brewSettings,
        ]);
    }

    public function brewGuideDetail(string $slug): Response
    {
        $guide = BrewGuide::where('slug', $slug)->firstOrFail();
        $otherGuides = BrewGuide::where('id', '!=', $guide->id)->orderBy('sort_order')->take(3)->get();

        return Inertia::render('brew-guide/show', [
            'guide' => $guide,
            'otherGuides' => $otherGuides,
        ]);
    }

    public function blog(): Response
    {
        $pageBlog = Setting::get('page_blog', []);
        $perPage = ! empty($pageBlog['posts_per_page']) ? (int) $pageBlog['posts_per_page'] : 9;
        $posts = Post::articles()->published()->latest('published_at')->paginate($perPage);

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'page' => $pageBlog,
        ]);
    }

    public function blogDetail(string $slug): Response
    {
        $post = Post::articles()->published()->where('slug', $slug)->firstOrFail();
        $relatedPosts = Post::articles()->published()->where('id', '!=', $post->id)->latest('published_at')->take(3)->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'contentHtml' => $post->renderContentHtml(),
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function events(): Response
    {
        $upcoming = Event::upcoming()->get();
        $past = Event::where('starts_at', '<', now())
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '<', now());
            })
            ->latest('starts_at')
            ->take(6)
            ->get();

        return Inertia::render('events/index', [
            'upcoming' => $upcoming,
            'past' => $past,
            'page' => Setting::get('page_events', []),
        ]);
    }

    public function reels(): Response
    {
        return Inertia::render('reels/index', [
            'reels' => VideoReel::active()->ordered()->get(),
        ]);
    }

    public function legal(string $type = 'privacy'): Response
    {
        $titles = [
            'privacy' => 'Kebijakan Privasi / Privacy Policy',
            'terms' => 'Syarat & Ketentuan / Terms & Conditions',
            'refund' => 'Kebijakan Pengembalian & Garansi Kesegaran',
        ];

        return Inertia::render('legal', [
            'type' => $type,
            'title' => $titles[$type] ?? 'Informasi Legal',
        ]);
    }

    public function booking(): Response
    {
        $defaultPage = [
            'hero_badge' => 'Reservasi & Sewa Tempat di Sanubari Roastery',
            'hero_title' => 'Booking Tempat Nyaman untuk Acara & Komunitas di Sanubari',
            'hero_description' => 'Ruang estetik, nyaman, dan ber-AC untuk workshop, meeting kerja, gathering komunitas, maupun private event Anda di Malang. Tanpa biaya sewa ruangan terpisah — cukup dengan minimum spent ngopi & jajan di Sanubari Roastery.',
            'hero_image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
            'benefits' => [
                [
                    'title' => 'Muat Hingga Lebih dari 50 Orang',
                    'badge' => 'Kapasitas Luas',
                    'description' => 'Ruang indoor dan semi-outdoor yang leluasa menampung hingga lebih dari 50 peserta dengan susunan kursi fleksibel (theater, workshop, diskusi, atau round table).',
                    'icon' => 'users',
                ],
                [
                    'title' => 'Free Proyektor',
                    'badge' => 'Fasilitas Gratis',
                    'description' => 'Fasilitas unit proyektor jernih dan layar screen siap pakai untuk presentasi kerja, pemutaran video materi, atau nobar tanpa biaya sewa tambahan.',
                    'icon' => 'projector',
                ],
                [
                    'title' => 'Free Sound System',
                    'badge' => 'Fasilitas Gratis',
                    'description' => 'Audio sound system jernih dan microphone wireless gratis untuk mendukung kelancaran pemandu acara, moderator, serta musik pengiring suasana.',
                    'icon' => 'volume-2',
                ],
                [
                    'title' => 'Cukup dengan Minimum Spent Ngopi di Sanubari',
                    'badge' => 'Tanpa Biaya Sewa Ruang',
                    'description' => 'Bebas biaya sewa gedung atau room charge terpisah! Cukup penuhi minimum spent pesanan kopi artisan, minuman segar, dan aneka menu makanan lezat Sanubari.',
                    'icon' => 'coffee',
                ],
            ],
            'facilities' => [
                ['title' => 'Ruangan Ber-AC & Sejuk', 'description' => 'Suhu udara sejuk dan nyaman selama kegiatan berlangsung.', 'icon' => 'zap'],
                ['title' => 'High-Speed Wi-Fi', 'description' => 'Koneksi internet cepat untuk meeting daring, presentasi online, dan live streaming.', 'icon' => 'wifi'],
                ['title' => 'Banyak Colokan Listrik', 'description' => 'Stopkontak melimpah di setiap area tempat duduk untuk laptop dan gawai.', 'icon' => 'plug'],
                ['title' => 'Area Parkir Luas & Aman', 'description' => 'Akses mudah di Ruko Tlogomas Square dengan fasilitas parkir mobil dan motor yang aman.', 'icon' => 'building-2'],
            ],
            'event_types' => [
                'Workshop & Kelas Pelatihan',
                'Meeting Kerja & Seminar Kantor',
                'Gathering Komunitas & Reuni',
                'Ulang Tahun & Intimate Party',
                'Bedah Buku, Talkshow, & Mini Showcase',
                'Nonton Bareng & Diskusi Kreatif',
            ],
            'gallery_title' => 'Dokumentasi Suasana Ruangan & Acara',
            'gallery_subtitle' => 'Momen kehangatan workshop, meeting, dan gathering komunitas di Sanubari Roastery Malang.',
            'grid_desktop' => '3',
            'grid_tablet' => '2',
            'grid_mobile' => '1',
            'image_aspect' => 'aspect-4/3',
            'gallery_images' => [
                [
                    'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Suasana Ruangan Luas & Meja Diskusi Komunitas',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Presentasi & Workshop dengan Proyektor Layar Lebar',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Sound System & Mic Wireless Jernih untuk Gathering',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Kopi Artisan & Fresh Brew Disajikan Langsung dari Slow Bar',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Kenyamanan Berkumpul dengan Ruangan Ber-AC & Stopkontak Melimpah',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Kapasitas Nyaman untuk Lebih dari 50 Tamu Undangan',
                ],
            ],
            'whatsapp_number' => '6285121930454',
            'address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
            'hours' => 'Setiap Hari: 09.00 – 23.00 WIB',
            'maps_url' => 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
            'form_title' => 'Formulir Reservasi Tempat',
            'form_subtitle' => 'Isi detail rencana acara Anda di bawah ini untuk langsung terhubung ke WhatsApp reservasi Sanubari Roastery.',
        ];

        $saved = Setting::get('page_booking_tempat', []);
        $page = array_merge($defaultPage, is_array($saved) ? $saved : []);

        return Inertia::render('booking', [
            'page' => $page,
        ]);
    }

    public function coffeeCatering(): Response
    {
        $defaultPage = [
            'hero_badge' => 'Live Espresso Bar & Coffee Catering',
            'hero_title' => 'Sanubari Coffee Catering untuk Segala Momen Spesial Anda',
            'hero_description' => 'Hadirkan pengalaman specialty coffee bar autentik langsung di lokasi acara Anda di Malang & sekitarnya. Cocok untuk Wedding, Acara Kantor, Acara Seminar, maupun Acara Keluarga dengan minimum order 200 cup dan racikan barista profesional Sanubari.',
            'hero_image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
            'minimum_order_cups' => '200',
            'benefits' => [
                [
                    'title' => 'Minimum Order 200 Cup',
                    'badge' => 'Kapasitas Fleksibel',
                    'description' => 'Mulai dari 200 cup fresh coffee, sangat ideal untuk intimate party keluarga, acara kantor, hingga resepsi pernikahan akbar.',
                    'is_highlight' => false,
                ],
                [
                    'title' => 'Pelayanan Langsung di Tempat Acara',
                    'badge' => 'Live Espresso Bar',
                    'description' => 'Tim barista profesional Sanubari hadir langsung di lokasi acara dengan setup mobile coffee bar lengkap, menyajikan kopi segar di hadapan tamu.',
                    'is_highlight' => false,
                ],
                [
                    'title' => 'Peralatan Espresso Komersial',
                    'badge' => 'Peralatan Lengkap',
                    'description' => 'Mesin espresso standar specialty coffee, grinder presisi, cooling ice station, dan booth bar estetis yang siap mempercantik dekorasi acara Anda.',
                    'is_highlight' => false,
                ],
                [
                    'title' => 'Biji Kopi Fresh Roast Khas Sanubari',
                    'badge' => 'Specialty Grade 1',
                    'description' => 'Pilihan espresso blend dan single origin artisan khas Sanubari Roastery. Cita rasa kaya, manis seimbang, dan ramah di lambung para tamu undangan.',
                    'is_highlight' => true,
                ],
            ],
            'occasions' => [
                [
                    'name' => 'Wedding & Resepsi Pernikahan',
                ],
                [
                    'name' => 'Acara Kantor & Corporate Gathering',
                ],
                [
                    'name' => 'Acara Seminar & Konferensi',
                ],
                [
                    'name' => 'Acara Keluarga & Private Party',
                ],
            ],
            'gallery_title' => 'Dokumentasi Live Coffee Bar & Catering Acara',
            'gallery_subtitle' => 'Momen kebahagiaan para tamu menikmati racikan segar Sanubari di berbagai pesta pernikahan, kantor, dan seminar.',
            'grid_desktop' => '3',
            'grid_tablet' => '2',
            'grid_mobile' => '1',
            'image_aspect' => 'aspect-4/3',
            'gallery_images' => [
                [
                    'image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Live Espresso Bar & Barista Standby di Lokasi Pernikahan',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Coffee Break Cepat & Tertib untuk Seminar Ratusan Peserta',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Booth Estetis Menghangatkan Suasana Corporate Gathering Kantor',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Fresh Pour Over & Manual Brew Disajikan Langsung untuk Pecinta Kopi',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Pilihan Es Kopi Susu Gula Aren & Minuman Non-Coffee Favorit Keluarga',
                ],
                [
                    'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                    'caption' => 'Peralatan Higienis, Rapi, dan Menunjang Estetika Dekorasi Acara',
                ],
            ],
            'whatsapp_number' => '6285121930454',
            'form_title' => 'Konsultasi Jadwal & Pemesanan Coffee Catering',
            'form_subtitle' => 'Isi formulir singkat di bawah ini untuk mendapatkan penawaran harga & paket coffee catering Sanubari via WhatsApp.',
            'terms_note' => '*Minimum pemesanan 200 cup. Pemesanan disarankan minimal H-7 acara untuk persiapan jadwal tim barista dan ketersediaan mesin.',
            'address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
            'hours' => 'Setiap Hari: 09.00 – 23.00 WIB',
            'maps_url' => 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
        ];

        $saved = Setting::get('page_coffee_catering', []);
        $page = array_merge($defaultPage, is_array($saved) ? $saved : []);

        return Inertia::render('coffee-catering', [
            'page' => $page,
        ]);
    }
}
