<div
    x-data="{
        lat: $wire.entangle('data.shipping_origin_latitude'),
        lng: $wire.entangle('data.shipping_origin_longitude'),
        map: null,
        marker: null,
        searchQuery: '',
        isSearching: false,
        statusMsg: '',

        initMap() {
            if (this.map) return;

            // Ensure Leaflet is loaded
            if (typeof L === 'undefined') {
                if (!document.getElementById('leaflet-css')) {
                    const link = document.createElement('link');
                    link.id = 'leaflet-css';
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                }

                if (!document.getElementById('leaflet-js')) {
                    const script = document.createElement('script');
                    script.id = 'leaflet-js';
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => {
                        this.$nextTick(() => this.setupLeaflet());
                    };
                    document.head.appendChild(script);
                } else {
                    const checkInterval = setInterval(() => {
                        if (typeof L !== 'undefined') {
                            clearInterval(checkInterval);
                            this.setupLeaflet();
                        }
                    }, 100);
                }
            } else {
                this.$nextTick(() => this.setupLeaflet());
            }
        },

        setupLeaflet() {
            const container = this.$refs.mapContainer;
            if (!container || this.map) return;

            let curLat = parseFloat(this.lat) || -7.9327;
            let curLng = parseFloat(this.lng) || 112.6037;

            this.map = L.map(container).setView([curLat, curLng], 16);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            const icon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            this.marker = L.marker([curLat, curLng], {
                draggable: true,
                icon: icon
            }).addTo(this.map);

            this.marker.bindPopup('<b>Sanubari Roastery (Origin)</b><br>Tlogomas, Lowokwaru, Kota Malang').openPopup();

            // When marker is dragged
            this.marker.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                this.updateCoords(pos.lat, pos.lng);
            });

            // When map is clicked
            this.map.on('click', (e) => {
                this.marker.setLatLng(e.latlng);
                this.updateCoords(e.latlng.lat, e.latlng.lng);
            });

            // Fix tiles not rendering properly in hidden/collapsible tabs
            setTimeout(() => {
                this.map.invalidateSize();
            }, 300);
        },

        updateCoords(newLat, newLng) {
            const rLat = parseFloat(newLat.toFixed(6));
            const rLng = parseFloat(newLng.toFixed(6));
            this.lat = rLat;
            this.lng = rLng;
            this.statusMsg = `Titik lokasi disetel ke: ${rLat}, ${rLng}`;
            setTimeout(() => { this.statusMsg = ''; }, 4000);
        },

        setRoasteryDefault() {
            const defLat = -7.9327;
            const defLng = 112.6037;
            if (this.map && this.marker) {
                this.map.setView([defLat, defLng], 16);
                this.marker.setLatLng([defLat, defLng]);
            }
            this.updateCoords(defLat, defLng);
        },

        useMyLocation() {
            if (!navigator.geolocation) {
                alert('Browser Anda tidak mendukung geolokasi GPS.');
                return;
            }
            this.isSearching = true;
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    this.isSearching = false;
                    const uLat = pos.coords.latitude;
                    const uLng = pos.coords.longitude;
                    if (this.map && this.marker) {
                        this.map.setView([uLat, uLng], 17);
                        this.marker.setLatLng([uLat, uLng]);
                    }
                    this.updateCoords(uLat, uLng);
                },
                (err) => {
                    this.isSearching = false;
                    alert('Gagal mengambil lokasi GPS: ' + err.message);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        },

        async searchAddress() {
            if (!this.searchQuery.trim()) return;
            this.isSearching = true;
            try {
                const q = encodeURIComponent(this.searchQuery + ', Malang, Jawa Timur');
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
                const data = await res.json();
                if (data && data.length > 0) {
                    const sLat = parseFloat(data[0].lat);
                    const sLng = parseFloat(data[0].lon);
                    if (this.map && this.marker) {
                        this.map.setView([sLat, sLng], 17);
                        this.marker.setLatLng([sLat, sLng]);
                    }
                    this.updateCoords(sLat, sLng);
                } else {
                    alert('Alamat tidak ditemukan. Coba geser pin secara manual di peta.');
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.isSearching = false;
            }
        }
    }"
    x-init="initMap()"
    class="space-y-3"
>
    <div class="flex flex-wrap items-center justify-between gap-2">
        <label class="text-sm font-medium text-gray-950 dark:text-white flex items-center gap-1.5">
            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Titik Peta Lokasi Asal (Origin Pinpoint) — Titik Acuan GoSend Instant</span>
        </label>
        <span class="text-xs text-gray-500 dark:text-gray-400">
            Klik pada peta atau geser pin merah untuk mengubah titik koordinat asal
        </span>
    </div>

    <!-- Search & Quick Action Buttons -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div class="sm:col-span-7 flex gap-1.5">
            <input
                type="text"
                x-model="searchQuery"
                @keydown.enter.prevent="searchAddress()"
                placeholder="Cari lokasi (contoh: Ruko Tlogomas Square Malang)..."
                class="w-full text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
            <button
                type="button"
                @click="searchAddress()"
                :disabled="isSearching"
                class="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap disabled:opacity-50"
            >
                <span x-show="!isSearching">Cari</span>
                <span x-show="isSearching">...</span>
            </button>
        </div>

        <div class="sm:col-span-5 flex gap-2">
            <button
                type="button"
                @click="setRoasteryDefault()"
                class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-700 truncate cursor-pointer"
                title="Pusat Sanubari Roastery Tlogomas"
            >
                📍 Sanubari Tlogomas
            </button>
            <button
                type="button"
                @click="useMyLocation()"
                :disabled="isSearching"
                class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-700 truncate"
                title="Gunakan Lokasi GPS Saat Ini"
            >
                🧭 GPS Saya
            </button>
        </div>
    </div>

    <!-- Status message badge -->
    <template x-if="statusMsg">
        <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <span x-text="statusMsg"></span>
        </div>
    </template>

    <!-- Map Container -->
    <div
        x-ref="mapContainer"
        class="w-full h-80 rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm z-0 relative overflow-hidden"
    ></div>

    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <div>
            Koordinat Aktif:
            <strong class="text-gray-900 dark:text-gray-100" x-text="lat || '-7.9327'"></strong>,
            <strong class="text-gray-900 dark:text-gray-100" x-text="lng || '112.6037'"></strong>
        </div>
        <div>
            <span>Sanubari Roastery · Malang</span>
        </div>
    </div>
</div>

