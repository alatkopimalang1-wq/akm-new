import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
    Compass,
    Eye,
    Maximize2,
    Minimize2,
    Move,
    Pause,
    Play,
    RotateCcw,
    X,
    Sparkles,
    ExternalLink,
    ChevronDown,
} from 'lucide-react';

export interface HelixGalleryItem {
    id: string | number;
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    badge?: string;
    category?: string;
    linkUrl?: string;
    linkLabel?: string;
}

// Procedural minimalist vector landscape generator (matching reference image style: clean flowing dunes & mountains)
const generateProceduralTexture = (index: number): string => {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600; // 4:3 aspect ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Color palettes inspired by the reference screenshot (pure vector landscapes)
    const palettes = [
        // 0. Warm Orange/Gold Dunes (Reference Center image)
        {
            sky: ['#f4efe8', '#f2e8dc', '#ecd5be'],
            sun: '#fffdfa',
            sunGlow: 'rgba(245, 158, 11, 0.25)',
            layers: ['#f59e0b', '#ea580c', '#c2410c'],
            hasSun: true,
        },
        // 1. Teal / Ocean Blue Hills (Reference Top-Left image)
        {
            sky: ['#e2edf3', '#c8dfe8', '#99c2d4'],
            sun: '#ffffff',
            sunGlow: 'rgba(14, 165, 233, 0.25)',
            layers: ['#38bdf8', '#0284c7', '#0369a1'],
            hasSun: true,
        },
        // 2. Slate Blue Twilight (Reference Top-Right image)
        {
            sky: ['#eaedf1', '#dbe2e8', '#b8c5d2'],
            sun: '#ffffff',
            sunGlow: 'rgba(100, 116, 139, 0.2)',
            layers: ['#64748b', '#475569', '#334155'],
            hasSun: false,
        },
        // 3. Lavender / Purple Hills (Reference Bottom-Left image)
        {
            sky: ['#f3edf7', '#e8dcf0', '#d3bee3'],
            sun: '#ffffff',
            sunGlow: 'rgba(168, 85, 247, 0.2)',
            layers: ['#c084fc', '#9333ea', '#6b21a8'],
            hasSun: false,
        },
        // 4. Soft Golden Sand Dunes (Reference Bottom-Center image)
        {
            sky: ['#fbf8ed', '#f5eed3', '#e8dcb3'],
            sun: '#fffef5',
            sunGlow: 'rgba(234, 179, 8, 0.25)',
            layers: ['#fde047', '#eab308', '#ca8a04'],
            hasSun: true,
        },
        // 5. Deep Indigo / Night Hills
        {
            sky: ['#e6e9f5', '#ccd4eb', '#99a9d8'],
            sun: '#ffffff',
            sunGlow: 'rgba(99, 102, 241, 0.2)',
            layers: ['#818cf8', '#4f46e5', '#312e81'],
            hasSun: false,
        },
        // 6. Emerald / Sage Green Forest Ridges
        {
            sky: ['#edf5ef', '#dbeee0', '#b9dfc2'],
            sun: '#ffffff',
            sunGlow: 'rgba(34, 197, 94, 0.2)',
            layers: ['#4ade80', '#16a34a', '#14532d'],
            hasSun: true,
        },
        // 7. Coral Rose / Sunrise
        {
            sky: ['#faecee', '#f5d9dc', '#eeb8be'],
            sun: '#fff5f6',
            sunGlow: 'rgba(244, 63, 94, 0.25)',
            layers: ['#fb7185', '#e11d48', '#881337'],
            hasSun: true,
        },
        // 8. Dusty Mint & Teal
        {
            sky: ['#eaf7f5', '#d4eee9', '#a9dcd3'],
            sun: '#ffffff',
            sunGlow: 'rgba(20, 184, 166, 0.2)',
            layers: ['#2dd4bf', '#0d9488', '#115e59'],
            hasSun: true,
        },
        // 9. Warm Copper Roast Terroir
        {
            sky: ['#f7eee9', '#eddcd3', '#dcbeaf'],
            sun: '#fffbf9',
            sunGlow: 'rgba(217, 119, 6, 0.25)',
            layers: ['#fb923c', '#d97706', '#7c2d12'],
            hasSun: false,
        },
        // 10. Alpine Morning Fog
        {
            sky: ['#eef2f6', '#dde4ec', '#bcc8d8'],
            sun: '#ffffff',
            sunGlow: 'rgba(56, 189, 248, 0.25)',
            layers: ['#7dd3fc', '#0284c7', '#1e293b'],
            hasSun: true,
        },
        // 11. Sunset Horizon Lereng Kawi
        {
            sky: ['#f9ebea', '#f3d4d2', '#e5aba7'],
            sun: '#ffffff',
            sunGlow: 'rgba(239, 68, 68, 0.25)',
            layers: ['#f87171', '#dc2626', '#450a0a'],
            hasSun: true,
        },
    ];

    const p = palettes[index % palettes.length];

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.75);
    p.sky.forEach((c, i) => skyGrad.addColorStop(i / (p.sky.length - 1), c));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Sun (if present in palette)
    if (p.hasSun) {
        const sunX = canvas.width * 0.48;
        const sunY = canvas.height * 0.32;
        const sunR = 45;

        const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR * 2.2);
        glow.addColorStop(0, p.sunGlow);
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.sun;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Flowing Curved Mountain / Dune Layers
    // Layer 1 (Distant)
    ctx.fillStyle = p.layers[0];
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.48);
    ctx.bezierCurveTo(
        canvas.width * 0.25,
        canvas.height * 0.38,
        canvas.width * 0.65,
        canvas.height * 0.54,
        canvas.width,
        canvas.height * 0.44
    );
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Layer 2 (Middle)
    ctx.fillStyle = p.layers[1];
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.62);
    ctx.bezierCurveTo(
        canvas.width * 0.32,
        canvas.height * 0.72,
        canvas.width * 0.68,
        canvas.height * 0.46,
        canvas.width,
        canvas.height * 0.58
    );
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Layer 3 (Foreground Main Dune)
    ctx.fillStyle = p.layers[2];
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(0, canvas.height * 0.75);
    ctx.bezierCurveTo(
        canvas.width * 0.38,
        canvas.height * 0.58,
        canvas.width * 0.72,
        canvas.height * 0.82,
        canvas.width,
        canvas.height * 0.72
    );
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    return canvas.toDataURL('image/jpeg', 0.94);
};

export const defaultHelixGalleryItems: HelixGalleryItem[] = [
    {
        id: 'kawi-1',
        title: 'Lereng Gunung Kawi',
        subtitle: 'Elevasi 1.400 mdpl',
        category: 'Single Origin Terroir',
        badge: 'Gunung Kawi',
        description:
            'Tanah vulkanik subur lereng Gunung Kawi Malang, tempat pohon kopi Typica dan Kartika tumbuh alami di bawah naungan pohon pinus dan cemara.',
        linkUrl: '/shop?series=kawi',
        linkLabel: 'Jelajah Kopi Kawi',
    },
    {
        id: 'kawi-2',
        title: 'Matahari Terbit Puncak Kawi',
        subtitle: 'Panorama 2.851 mdpl',
        category: 'Lanskap Alam',
        badge: 'Panorama',
        description:
            'Cahaya fajar menyinari hamparan perkebunan kopi arabika di lereng selatan Malang, menghadirkan suhu mikro ideal untuk pematangan cherry kopi secara lambat.',
        linkUrl: '/kunjungi',
        linkLabel: 'Kunjungi Kebun & Roastery',
    },
    {
        id: 'kawi-3',
        title: 'Panen Cherry Merah Pilihan',
        subtitle: 'Petik Merah 100%',
        category: 'Proses Pasca Panen',
        badge: 'Sortasi Ketat',
        description:
            'Proses seleksi ketat cherry kopi matang sempurna bersama kelompok tani lokal Malang demi memastikan kemanisan brix optimal sebelum proses fermentasi.',
        linkUrl: '/panduan-seduh',
        linkLabel: 'Pelajari Proses',
    },
    {
        id: 'kawi-4',
        title: 'Honey & Natural Process',
        subtitle: 'Fermentasi Terkontrol',
        category: 'Pengolahan Biji',
        badge: 'Micro-Lot',
        description:
            'Pengeringan di atas raised bed dengan sirkulasi udara pegunungan segar untuk mengunci karakter rasa buah tropis, madu hutan, dan keasaman sitrus yang cerah.',
        linkUrl: '/shop?series=honey',
        linkLabel: 'Beli Kopi Honey',
    },
    {
        id: 'kawi-5',
        title: 'Sanubari Roastery Lab',
        subtitle: 'Tlogomas Square Malang',
        category: 'Roasting & Cupping',
        badge: 'Roaster Lab',
        description:
            'Laboratorium sangrai modern tempat profiling kurva sangrai dikembangkan secara presisi demi menonjolkan potensi terbaik setiap lot biji kopi.',
        linkUrl: '/roasting',
        linkLabel: 'Lihat Layanan Roasting',
    },
    {
        id: 'kawi-6',
        title: 'Sensory Cupping Table',
        subtitle: 'SCA Protocol Standard',
        category: 'Kalibrasi Rasa',
        badge: 'Sensory Lab',
        description:
            'Sesi cupping berkala setiap pekan untuk mengevaluasi konsistensi profil rasa, aroma, sweetness, dan body sebelum disajikan kepada penikmat kopi.',
        linkUrl: '/acara',
        linkLabel: 'Ikuti Sesi Cupping',
    },
    {
        id: 'kawi-7',
        title: 'Slow Bar Experience',
        subtitle: 'Seduhan Manual Presisi',
        category: 'Pengalaman Rasa',
        badge: 'Slow Bar',
        description:
            'Ruang santai berdiskusi rasa, mencicipi pour over V60, Origami, atau Aeropress dengan rasio dan temperatur air yang dikalibrasi harian.',
        linkUrl: '/kunjungi',
        linkLabel: 'Reservasi Slow Bar',
    },
    {
        id: 'kawi-8',
        title: 'Inovasi CO-Ferment',
        subtitle: 'Eksperimen Rasa Buah Alami',
        category: 'Inovasi Rasa',
        badge: 'Specialty Innovation',
        description:
            'Kolaborasi fermentasi buah alami dengan ragi pilihan menghasilkan sensasi rasa peach, stroberi liar, dan aroma bunga yang memikat indra.',
        linkUrl: '/shop?series=co-ferment',
        linkLabel: 'Coba Kopi CO-Ferment',
    },
    {
        id: 'kawi-9',
        title: 'Biji Sangrai Espresso Kawi',
        subtitle: 'Keseimbangan Manis & Cokelat',
        category: 'Espresso Blend',
        badge: 'House Blend',
        description:
            'Formulasi sangrai medium-dark yang lembut, dirancang untuk menghasilkan ekstraksi espresso tebal beraroma cokelat hitam, gula aren, dan aftertaste manis panjang.',
        linkUrl: '/shop?category=espresso-beans',
        linkLabel: 'Beli Espresso Roast',
    },
    {
        id: 'kawi-10',
        title: 'Komunitas Barista & Edukasi',
        subtitle: 'Ruang Kolaborasi Malang',
        category: 'Edukasi Kopi',
        badge: 'Workshop',
        description:
            'Program pelatihan barista, kelas sensory, dan workshop teknik seduh manual untuk barista rumahan maupun profesional di Malang Raya.',
        linkUrl: '/pelatihan-barista',
        linkLabel: 'Daftar Pelatihan',
    },
    {
        id: 'kawi-11',
        title: 'Senja di Lereng Gunung',
        subtitle: 'Hawa Dingin Pegunungan',
        category: 'Atmosfer Kawi',
        badge: 'Jejak Rasa',
        description:
            'Menikmati secangkir seduhan hangat di tengah kabut sore yang turun perlahan dari lereng Gunung Kawi, menghangatkan jiwa di tiap sesapan.',
        linkUrl: '/blog',
        linkLabel: 'Baca Cerita Roaster',
    },
    {
        id: 'kawi-12',
        title: 'Kemitraan Petani Lokal',
        subtitle: 'Fair & Direct Trade',
        category: 'Keberlanjutan',
        badge: 'Fair Trade',
        description:
            'Komitmen Sanubari Roastery untuk memberdayakan petani kopi lokal lereng Kawi melalui harga pembelian yang adil dan transfer pengetahuan budidaya berkelanjutan.',
        linkUrl: '/tentang-kami',
        linkLabel: 'Tentang Sanubari',
    },
    {
        id: 'kawi-13',
        title: 'Wet Hulling Klasik Jawa',
        subtitle: 'Tradisi Giling Basah',
        category: 'Metode Pengolahan',
        badge: 'Tradisi',
        description:
            'Metode legendaris yang menghasilkan body kopi tebal, aroma rempah khas, dan tingkat keasaman yang seimbang bersahaja.',
        linkUrl: '/panduan-seduh',
        linkLabel: 'Pelajari Metode',
    },
    {
        id: 'kawi-14',
        title: 'Sortasi Meja Gravitasi',
        subtitle: 'Kerapatan Biji Maksimal',
        category: 'Quality Control',
        badge: 'Grading',
        description:
            'Pemisahan green beans berdasarkan densitas dan ukuran untuk menjamin keseragaman kematangan sangrai di setiap batch roaster.',
        linkUrl: '/roasting',
        linkLabel: 'Lihat Standar QC',
    },
    {
        id: 'kawi-15',
        title: 'Cold Drip & Nitro Brew',
        subtitle: 'Ekstraksi Dingin 12 Jam',
        category: 'Seduhan Inovatif',
        badge: 'Cold Brew',
        description:
            'Tetesan air dingin lambat mengesktrak rasa manis manis bunga kopi dan cokelat susu tanpa mengekstrak asam pahit berlebih.',
        linkUrl: '/kunjungi',
        linkLabel: 'Cicipi Nitro Brew',
    },
    {
        id: 'kawi-16',
        title: 'Profil Sangrai Nordic',
        subtitle: 'Light Roast Bernuansa Bunga',
        category: 'Roast Profiling',
        badge: 'Nordic Style',
        description:
            'Pengembangan profil sangrai cerah yang menjaga keaslian karakter terroir Gunung Kawi dengan floral aroma melati dan jeruk purut.',
        linkUrl: '/shop?series=nordic',
        linkLabel: 'Jelajah Nordic Roast',
    },
    {
        id: 'kawi-17',
        title: 'Presisi Kalibrasi Grinder',
        subtitle: 'Distribusi Partikel Mikro',
        category: 'Barista Lab',
        badge: 'Presisi',
        description:
            'Pengecekan mikron gilingan setiap pagi menggunakan burr datar berlapis titanium demi ekstraksi espresso yang seimbang.',
        linkUrl: '/pelatihan-barista',
        linkLabel: 'Belajar Barista',
    },
    {
        id: 'kawi-18',
        title: 'Kemasan Degassing Valve',
        subtitle: 'Pelindung Kesegaran Aroma',
        category: 'Packaging',
        badge: 'Freshness',
        description:
            'Kantung aluminium foil food grade dengan one-way valve menjaga gas CO2 keluar alami tanpa membiarkan oksigen merusak aroma biji kopi.',
        linkUrl: '/shop',
        linkLabel: 'Belanja Kopi Segar',
    },
    {
        id: 'kawi-19',
        title: 'Kedai Roastery Tlogomas',
        subtitle: 'Titik Temu Penikmat Kopi',
        category: 'Komunitas & Ruang',
        badge: 'Tlogomas Lab',
        description:
            'Suasana hangat kedai di Ruko Tlogomas Square Kota Malang, tempat bertukar cerita aroma dan seduhan bersama para sangrai.',
        linkUrl: '/kunjungi',
        linkLabel: 'Petunjuk Arah Kedai',
    },
    {
        id: 'kawi-20',
        title: 'Harmoni Lereng & Kabut',
        subtitle: 'Arsip Visual Nusantara',
        category: 'Lanskap Kawi',
        badge: 'Sanubari Story',
        description:
            'Refleksi perjalanan dari lereng gunung hingga secangkir kopi di tangan Anda, membawa kehangatan dan rasa syukur di setiap tegukan.',
        linkUrl: '/tentang-kami',
        linkLabel: 'Baca Kisah Kami',
    },
];

interface HelicalRibbonGalleryProps {
    items?: HelixGalleryItem[];
    title?: string;
    subtitle?: string;
    badge?: string;
    className?: string;
    showHeader?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    visibleColumns?: number;
    tiersCount?: number;
}

export const HelicalRibbonGallery: React.FC<HelicalRibbonGalleryProps> = ({
    items = defaultHelixGalleryItems,
    title = '3D Image Helix — Arsip Visual Lereng Kawi',
    subtitle = 'Putar dan telusuri jejak visual perjalanan biji kopi dari lereng Gunung Kawi hingga meja sangrai Sanubari dalam pita spiral 3D interaktif.',
    badge = 'Galeri 3D Interaktif • Three.js',
    className = '',
    showHeader = false,
    autoRotate = true,
    autoRotateSpeed = 0.2,
    visibleColumns = 5,
    tiersCount = 2,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    // UI States
    const [selectedItem, setSelectedItem] = useState<HelixGalleryItem | null>(null);
    const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isInteracting, setIsInteracting] = useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    // Three.js internal mutable refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const helixGroupRef = useRef<THREE.Group | null>(null);
    const panelMeshesRef = useRef<{ mesh: THREE.Mesh; item: HelixGalleryItem; angle: number; y: number }[]>([]);
    const animationFrameIdRef = useRef<number | null>(null);

    // Motion & Physics State refs
    const motionRef = useRef({
        targetRotationY: 0,
        currentRotationY: 0,
        targetScrollY: 0,
        currentScrollY: 0,
        targetCameraZ: 7.8,
        currentCameraZ: 7.8,
        isDragging: false,
        lastPointerX: 0,
        lastPointerY: 0,
        pointerDownX: 0,
        pointerDownY: 0,
        pointerDownTime: 0,
        velocityRotationY: 0,
        velocityScrollY: 0,
        autoRotate: true,
        idleTimer: 0,
    });

    // Texture cache
    const texturesRef = useRef<THREE.Texture[]>([]);

    // Calculate dynamic layout parameters
    const columns = Math.max(3, Math.min(8, visibleColumns));
    const tiers = Math.max(1, Math.min(4, tiersCount));
    const itemsPerTurn = columns * 2;

    const calcCameraZ = useCallback((w: number) => {
        const colOffset = (columns - 5) * 0.75;
        if (w < 480) return 6.6 + colOffset;
        if (w < 640) return 7.0 + colOffset;
        if (w < 1024) return 9.8 + colOffset;
        return 9.0 + colOffset;
    }, [columns]);

    // Prepare gallery list (guarantee enough items to fill all tiers)
    const galleryItems = useMemo(() => {
        const source = items && items.length > 0 ? items : defaultHelixGalleryItems;
        const requiredCount = itemsPerTurn * tiers;
        if (source.length >= requiredCount) return source;
        const tiled: HelixGalleryItem[] = [];
        for (let i = 0; i < requiredCount; i++) {
            const original = source[i % source.length];
            tiled.push({
                ...original,
                id: `${original.id || 'kawi'}-${i}`,
            });
        }
        return tiled;
    }, [items, itemsPerTurn, tiers]);

    // Initialize Three.js scene
    useEffect(() => {
        const mount = canvasContainerRef.current;
        if (!mount) return;

        const width = mount.clientWidth || 800;
        const height = mount.clientHeight || 560;

        // 1. Scene with 100% transparent background (images float seamlessly)
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // 2. Camera with tuned perspective: columns across, tiers rows vertically
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        const initialZ = calcCameraZ(width);
        camera.position.set(0, 0, initialZ);
        motionRef.current.targetCameraZ = initialZ;
        motionRef.current.currentCameraZ = initialZ;
        motionRef.current.autoRotate = autoRotate;
        cameraRef.current = camera;

        // 3. Renderer with transparent alpha and optimal pixel ratio
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.NoToneMapping;
        rendererRef.current = renderer;

        // Mount canvas
        mount.replaceChildren(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.outline = 'none';
        renderer.domElement.style.cursor = 'grab';

        // 4. Lighting System
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.25);
        scene.add(ambientLight);

        // Key front directional light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(4, 7, 7);
        scene.add(keyLight);

        // Warm rim light highlighting the curved panel edges
        const rimLight = new THREE.DirectionalLight(0xd97706, 1.5);
        rimLight.position.set(-6, -3, -5);
        scene.add(rimLight);

        // Subtle top fill
        const topLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
        topLight.position.set(0, 8, 4);
        scene.add(topLight);

        // 5. Helical Geometry & Meshes: 3 Panels Across, 2 Rows Down
        const helixGroup = new THREE.Group();
        scene.add(helixGroup);
        helixGroupRef.current = helixGroup;

        // Helix Parametric Setup:
        // - itemsPerTurn panels per full 360° turn -> columns panels visible across the front 180° arc!
        // - Over tiers turns, forms tiers rows vertically!
        // - 4:3 panel aspect ratio with compact, elegant sizing
        const radius = 3.6;
        const totalItems = galleryItems.length;
        const angleStep = (Math.PI * 2) / itemsPerTurn;
        const panelArc = angleStep * 0.84;
        const curvedWidth = radius * panelArc;
        const panelHeight = (curvedWidth * 3) / 4; // 4:3 aspect ratio
        const tierSpacing = panelHeight * 1.21;
        const heightStep = tierSpacing / itemsPerTurn;
        const totalHelixHeight = (totalItems - 1) * heightStep;

        // Reusable Curved Cylinder Arc Geometry for natural curvature
        const frontGeometry = new THREE.CylinderGeometry(
            radius,
            radius,
            panelHeight,
            28,
            1,
            true,
            -panelArc / 2,
            panelArc
        );

        // Back-face geometry (slightly recessed for physical depth & realistic shadow)
        const backGeometry = new THREE.CylinderGeometry(
            radius * 0.995,
            radius * 0.995,
            panelHeight * 0.996,
            28,
            1,
            true,
            -panelArc / 2,
            panelArc
        );

        // Shared back-face material: sleek clean neutral dark slate
        const backMaterial = new THREE.MeshBasicMaterial({
            color: 0x18181b,
            side: THREE.BackSide,
        });

        const textureLoader = new THREE.TextureLoader();
        const loadedTextures: THREE.Texture[] = [];
        const panels: { mesh: THREE.Mesh; item: HelixGalleryItem; angle: number; y: number }[] = [];

        // Build panels in the helix
        galleryItems.forEach((item, index) => {
            const angle = index * angleStep;
            const yPos = index * heightStep - totalHelixHeight / 2;

            // Generate or load texture
            let texture: THREE.Texture;
            if (item.image && (item.image.startsWith('http') || item.image.startsWith('/'))) {
                texture = textureLoader.load(item.image);
            } else {
                const dataUrl = generateProceduralTexture(index);
                const img = new Image();
                img.src = dataUrl;
                texture = new THREE.Texture(img);
                img.onload = () => {
                    texture.needsUpdate = true;
                };
            }

            if ('colorSpace' in texture) {
                texture.colorSpace = THREE.SRGBColorSpace;
            }

            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTextures.push(texture);

            // Front Material: Pure original photo colors without any lighting, specular, or shading effects
            const frontMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.FrontSide,
                toneMapped: false,
            });

            // Front Mesh
            const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
            frontMesh.userData = { index, item };

            // Back Mesh
            const backMesh = new THREE.Mesh(backGeometry, backMaterial);

            // Panel Assembly Group
            const panelGroup = new THREE.Group();
            panelGroup.position.set(0, yPos, 0);
            panelGroup.rotation.y = angle;

            // Subtle pitch tilt along the helical slope
            const slopeAngle = Math.atan2(heightStep, radius * angleStep) * 0.35;
            frontMesh.rotation.z = -slopeAngle;
            backMesh.rotation.z = -slopeAngle;

            panelGroup.add(frontMesh);
            panelGroup.add(backMesh);

            helixGroup.add(panelGroup);

            panels.push({
                mesh: frontMesh,
                item,
                angle,
                y: yPos,
            });
        });

        panelMeshesRef.current = panels;
        texturesRef.current = loadedTextures;

        // 6. Raycaster for click interaction
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        // 7. Interaction Event Handlers
        const onPointerDown = (e: PointerEvent) => {
            // Disable drag/scroll interaction on mobile devices so page scrolls naturally
            if (e.pointerType === 'touch' || window.innerWidth < 640) {
                return;
            }

            const m = motionRef.current;
            m.isDragging = true;
            m.lastPointerX = e.clientX;
            m.lastPointerY = e.clientY;
            m.pointerDownX = e.clientX;
            m.pointerDownY = e.clientY;
            m.pointerDownTime = performance.now();
            m.velocityRotationY = 0;
            m.velocityScrollY = 0;
            setIsInteracting(true);

            if (renderer.domElement) {
                renderer.domElement.style.cursor = 'grabbing';
            }
        };

        const onPointerMove = (e: PointerEvent) => {
            const m = motionRef.current;
            if (!m.isDragging) return;

            const deltaX = e.clientX - m.lastPointerX;
            const deltaY = e.clientY - m.lastPointerY;

            m.lastPointerX = e.clientX;
            m.lastPointerY = e.clientY;

            // Smooth drag sensitivity
            const rotDelta = deltaX * 0.0055;
            const scrollDelta = deltaY * 0.008;

            m.targetRotationY += rotDelta;
            m.targetScrollY -= scrollDelta;

            // Clamp vertical scroll
            const maxScroll = totalHelixHeight * 0.7;
            m.targetScrollY = Math.max(-maxScroll, Math.min(maxScroll, m.targetScrollY));

            m.velocityRotationY = rotDelta;
            m.velocityScrollY = scrollDelta;
        };

        const onPointerUp = (e: PointerEvent) => {
            const m = motionRef.current;
            if (!m.isDragging) return;
            m.isDragging = false;
            setIsInteracting(false);

            if (renderer.domElement) {
                renderer.domElement.style.cursor = 'grab';
            }

            const dist = Math.hypot(e.clientX - m.pointerDownX, e.clientY - m.pointerDownY);
            const duration = performance.now() - m.pointerDownTime;

            // Tap / Click detection (< 6px movement and < 350ms)
            if (dist < 6 && duration < 350) {
                const rect = renderer.domElement.getBoundingClientRect();
                pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const candidates = panelMeshesRef.current.map((p) => p.mesh);
                const intersects = raycaster.intersectObjects(candidates, false);

                if (intersects.length > 0) {
                    const hit = intersects[0].object as THREE.Mesh;
                    const itemData = hit.userData?.item as HelixGalleryItem;
                    if (itemData) {
                        setSelectedItem(itemData);

                        // Smoothly rotate helix to bring clicked panel toward center front
                        const hitRecord = panelMeshesRef.current.find((p) => p.mesh === hit);
                        if (hitRecord) {
                            const targetAngle = -hitRecord.angle;
                            const current = m.targetRotationY;
                            const diff = (targetAngle - current) % (Math.PI * 2);
                            const shortestDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
                            m.targetRotationY = current + shortestDiff;
                            m.targetScrollY = -hitRecord.y * 0.9;
                        }
                    }
                }
            }
        };

        const onWheel = (e: WheelEvent) => {
            if (window.innerWidth < 640) return;
            e.preventDefault();
            const m = motionRef.current;
            const scrollDelta = e.deltaY * 0.0035;
            m.targetScrollY += scrollDelta;

            const maxScroll = totalHelixHeight * 0.7;
            m.targetScrollY = Math.max(-maxScroll, Math.min(maxScroll, m.targetScrollY));
            m.idleTimer = 0;
        };

        const dom = renderer.domElement;
        dom.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        dom.addEventListener('wheel', onWheel, { passive: false });

        // 8. Responsive Resize Handler
        const handleResize = () => {
            if (!canvasContainerRef.current || !rendererRef.current || !cameraRef.current) return;
            const newWidth = canvasContainerRef.current.clientWidth;
            const newHeight = canvasContainerRef.current.clientHeight;

            cameraRef.current.aspect = newWidth / newHeight;
            motionRef.current.targetCameraZ = calcCameraZ(newWidth);

            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        };

        handleResize();
        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(mount);

        // 9. Main Animation Render Loop
        let lastTime = performance.now();

        const animate = (time: number) => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const delta = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;

            const m = motionRef.current;

            // Auto-rotation when idle
            if (m.autoRotate && !m.isDragging && !selectedItem) {
                m.targetRotationY += (autoRotateSpeed || 0.20) * delta; // gentle rotation
            }

            // On mobile devices, lock vertical position so images stay centered and do not drift
            if (typeof window !== 'undefined' && window.innerWidth < 640) {
                m.targetScrollY = 0;
            }

            // Smooth damping interpolation (lerp)
            const damping = 0.08;
            m.currentRotationY += (m.targetRotationY - m.currentRotationY) * damping;
            m.currentScrollY += (m.targetScrollY - m.currentScrollY) * damping;
            m.currentCameraZ += (m.targetCameraZ - m.currentCameraZ) * damping;

            if (helixGroupRef.current) {
                helixGroupRef.current.rotation.y = m.currentRotationY;
                helixGroupRef.current.position.y = -m.currentScrollY;
            }

            if (cameraRef.current) {
                cameraRef.current.position.z = m.currentCameraZ;
                cameraRef.current.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        };

        animationFrameIdRef.current = requestAnimationFrame(animate);

        // Cleanup on unmount
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }

            dom.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            dom.removeEventListener('wheel', onWheel);
            resizeObserver.disconnect();

            frontGeometry.dispose();
            backGeometry.dispose();
            backMaterial.dispose();

            loadedTextures.forEach((t) => t.dispose());
            renderer.dispose();
        };
    }, [galleryItems, calcCameraZ, itemsPerTurn, autoRotate, autoRotateSpeed]);

    // Toggle auto-rotation
    const toggleAutoRotate = useCallback(() => {
        setIsAutoRotating((prev) => {
            const next = !prev;
            motionRef.current.autoRotate = next;
            return next;
        });
    }, []);

    // Reset view position
    const resetView = useCallback(() => {
        motionRef.current.targetRotationY = 0;
        motionRef.current.targetScrollY = 0;
        const width = canvasContainerRef.current?.clientWidth || 800;
        motionRef.current.targetCameraZ = calcCameraZ(width);
        setZoomLevel(1);
    }, [calcCameraZ]);

    // Toggle fullscreen container
    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    }, []);

    return (
        <section
            ref={containerRef}
            className={`w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 my-2 sm:my-12 ${className}`}
        >
            {/* Header with Title & Editorial Badges (Hidden by default / Sembunyikan Tampilan) */}
            {showHeader && (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-copper/20 text-accent-copper border border-accent-copper/30">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{badge}</span>
                            </span>
                            <span className="text-[11px] text-brand-500 font-semibold hidden md:inline-flex items-center gap-1">
                                <Compass className="w-3 h-3 text-accent-copper" />
                                <span>5 Gambar Depan • 2 Baris Bertingkat • 360° Drag</span>
                            </span>
                        </div>

                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            {title}
                        </h2>

                        <p className="text-xs sm:text-sm text-brand-600 max-w-3xl leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    {/* Desktop Quick Guide Badges */}
                    <div className="hidden lg:flex items-center gap-2 text-xs text-brand-600 bg-sand-100/80 px-3.5 py-2 rounded-xl border border-sand-200">
                        <span className="inline-flex items-center gap-1">
                            <Move className="w-3.5 h-3.5 text-accent-copper" />
                            <span>Geser 360°</span>
                        </span>
                        <span className="text-sand-300">•</span>
                        <span className="inline-flex items-center gap-1">
                            <ChevronDown className="w-3.5 h-3.5 text-accent-copper" />
                            <span>Scroll 2 Tingkat</span>
                        </span>
                        <span className="text-sand-300">•</span>
                        <span className="inline-flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-accent-copper" />
                            <span>Klik gambar untuk memperbesar</span>
                        </span>
                    </div>
                </div>
            )}

            {/* 3D Helix Canvas Stage Container (100% Transparent / Melayang) */}
            <div className="relative w-full rounded-none sm:rounded-3xl overflow-hidden">
                {/* Canvas Mount Area (100% Transparent) */}
                <div
                    ref={canvasContainerRef}
                    className="w-full h-[220px] sm:h-[560px] lg:h-[620px] select-none touch-pan-y sm:touch-none pointer-events-none sm:pointer-events-auto bg-transparent"
                />

                {/* Top Control Bar Overlay (Desktop only) */}
                <div className="hidden sm:flex absolute top-3.5 sm:top-5 left-3.5 sm:left-5 right-3.5 sm:right-5 items-center justify-between pointer-events-none">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sand-300 text-brand-950 text-[11px] font-semibold shadow-md pointer-events-auto">
                        <span
                            className={`w-2 h-2 rounded-full ${
                                isAutoRotating ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`}
                        />
                        <span>{isAutoRotating ? 'Rotasi Otomatis' : 'Interaksi Manual'}</span>
                        <span className="text-brand-500 text-[10px]">({galleryItems.length} Segmen)</span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                        <button
                            type="button"
                            onClick={toggleAutoRotate}
                            aria-label={isAutoRotating ? 'Jeda Rotasi' : 'Mulai Rotasi'}
                            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 shadow-sm ${
                                isAutoRotating
                                    ? 'bg-white/90 text-brand-900 hover:bg-white border border-sand-300'
                                    : 'bg-accent-copper text-white hover:bg-accent-copper/90 shadow-md'
                            }`}
                        >
                            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{isAutoRotating ? 'Jeda' : 'Putar'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={resetView}
                            aria-label="Reset Posisi Kamera"
                            title="Reset Posisi Kamera"
                            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-white text-brand-900 border border-sand-300 backdrop-blur-md shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>

                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            aria-label="Layar Penuh"
                            title="Layar Penuh"
                            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs bg-white/90 hover:bg-white text-brand-900 border border-sand-300 backdrop-blur-md shadow-sm flex items-center transition-all active:scale-95"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-3.5 h-3.5" />
                            ) : (
                                <Maximize2 className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Lightbox for Clicked Gallery Image (Pure Image Viewer, No Titles, No Links) */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-transparent flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setSelectedItem(null)}
                            aria-label="Tutup Preview Gambar"
                            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 p-2 sm:p-2.5 rounded-full bg-sand-900/90 hover:bg-black text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Pure Image Container (4:3 ratio preserved, no text/titles, no links) */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-sand-950/60 max-h-[85vh] flex items-center justify-center">
                            <img
                                src={selectedItem.image || generateProceduralTexture(Number(selectedItem.id) || 0)}
                                alt="Galeri Sanubari"
                                className="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-2xl sm:rounded-3xl"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HelicalRibbonGallery;
