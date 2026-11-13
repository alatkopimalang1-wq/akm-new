import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, MapPin, Navigation, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShippingMapPickerProps {
    originLat?: number;
    originLng?: number;
    originName?: string;
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number, distanceKm: number) => void;
    cityName?: string;
}

// Calculate road distance with urban tortuosity factor (1.28)
function calcDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(0.5, Math.round(R * c * 1.28 * 10) / 10);
}

export function ShippingMapPicker({
    originLat = -7.9327,
    originLng = 112.6037,
    originName = 'Sanubari Roastery, Tlogomas',
    latitude,
    longitude,
    onChange,
    cityName = 'Kota Malang',
}: ShippingMapPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const originMarkerRef = useRef<L.Marker | null>(null);

    const currentLat = latitude ?? originLat;
    const currentLng = longitude ?? originLng;
    const hasPinpoint = latitude !== null && longitude !== null;

    const distanceKm = hasPinpoint
        ? calcDistanceKm(originLat, originLng, currentLat, currentLng)
        : null;

    // Initialize or update Leaflet map when opened
    useEffect(() => {
        if (!isOpen || !mapContainerRef.current) return;

        // Custom Destination Icon
        const destIcon = L.divIcon({
            className: 'custom-dest-pin',
            html: `
                <div style="background-color: #e11d48; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 34],
            popupAnchor: [0, -34],
        });

        // Roastery Store Icon
        const storeIcon = L.divIcon({
            className: 'custom-store-pin',
            html: `
                <div style="background-color: #2b1810; width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid #d4af37; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white;">
                    <span style="font-size: 14px;">☕</span>
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        });

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([currentLat, currentLng], 15);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            // Add Store Marker
            originMarkerRef.current = L.marker([originLat, originLng], { icon: storeIcon })
                .addTo(map)
                .bindPopup(`<b>${originName}</b><br><span style="font-size:11px;">Titik Asal Pengiriman</span>`);

            // Add Customer Destination Marker
            const marker = L.marker([currentLat, currentLng], {
                draggable: true,
                icon: destIcon,
            }).addTo(map);
            markerRef.current = marker;

            marker.bindPopup('<b>Titik Alamat Penerima</b><br><span style="font-size:11px;">Geser pin ini tepat ke depan rumah Anda</span>').openPopup();

            marker.on('dragend', (e) => {
                const pos = (e.target as L.Marker).getLatLng();
                const dist = calcDistanceKm(originLat, originLng, pos.lat, pos.lng);
                onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)), dist);
            });

            map.on('click', (e: L.LeafletMouseEvent) => {
                marker.setLatLng(e.latlng);
                const dist = calcDistanceKm(originLat, originLng, e.latlng.lat, e.latlng.lng);
                onChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)), dist);
            });
        } else {
            mapInstanceRef.current.setView([currentLat, currentLng], 15);
            if (markerRef.current) {
                markerRef.current.setLatLng([currentLat, currentLng]);
            }
        }

        const timer = setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [isOpen]);

    // Update marker position when lat/lng change from outside
    useEffect(() => {
        if (markerRef.current && latitude !== null && longitude !== null) {
            markerRef.current.setLatLng([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleUseGPS = () => {
        if (!navigator.geolocation) {
            alert('Perangkat Anda tidak mendukung fitur lokasi GPS.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setIsLocating(false);
                const uLat = Number(pos.coords.latitude.toFixed(6));
                const uLng = Number(pos.coords.longitude.toFixed(6));
                const dist = calcDistanceKm(originLat, originLng, uLat, uLng);

                onChange(uLat, uLng, dist);

                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([uLat, uLng], 16);
                    markerRef.current.setLatLng([uLat, uLng]);
                }
            },
            (err) => {
                setIsLocating(false);
                alert('Gagal mendeteksi lokasi GPS: ' + err.message + '. Silakan cari alamat atau geser pin manual di peta.');
            },
            { enableHighAccuracy: true, timeout: 12000 }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError('');

        try {
            const queryWithArea = `${searchQuery}, ${cityName}, Jawa Timur`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithArea)}&limit=1`);
            const data = await res.json();

            if (data && data.length > 0) {
                const sLat = Number(parseFloat(data[0].lat).toFixed(6));
                const sLng = Number(parseFloat(data[0].lon).toFixed(6));
                const dist = calcDistanceKm(originLat, originLng, sLat, sLng);

                onChange(sLat, sLng, dist);

                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([sLat, sLng], 16);
                    markerRef.current.setLatLng([sLat, sLng]);
                }
            } else {
                setSearchError('Lokasi tidak ditemukan. Coba masukkan nama jalan atau geser pin langsung di peta.');
            }
        } catch (err) {
            console.error(err);
            setSearchError('Gagal mencari lokasi. Silakan coba kembali.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="rounded-xl border border-sand-300 bg-sand-50/60 p-3 sm:p-4 space-y-3">
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-brand-950">
                            Titik Lokasi Alamat Pengiriman
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                            Akurasi GoSend
                        </span>
                    </div>
                    <p className="text-[11px] text-brand-600">
                        {hasPinpoint
                            ? `📍 Titik terpasang: ${currentLat}, ${currentLng} (${distanceKm} km dari Roastery)`
                            : 'Tentukan titik peta agar kurir GoSend dapat mengantar langsung ke depan pintu Anda.'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-sand-300 text-xs font-semibold text-brand-900 hover:bg-sand-100 transition-colors cursor-pointer shadow-2xs flex-shrink-0"
                >
                    <Crosshair className="w-3.5 h-3.5 text-brand-700" />
                    <span>{isOpen ? 'Tutup Peta' : (hasPinpoint ? 'Ubah Titik' : 'Pilih di Peta')}</span>
                </button>
            </div>

            {/* Quick GPS button when map is closed */}
            {!isOpen && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(true);
                            handleUseGPS();
                        }}
                        disabled={isLocating}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Mencari GPS...' : 'Gunakan Lokasi GPS Saya Saat Ini'}</span>
                    </button>

                    {hasPinpoint && distanceKm !== null && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-sand-200 text-xs font-semibold text-brand-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Jarak: <strong>{distanceKm} km</strong> ({distanceKm <= 25 ? '⚡ Dalam Jangkauan GoSend Instant' : 'Di luar jangkauan instan'})</span>
                        </div>
                    )}
                </div>
            )}

            {/* Expanded Interactive Map Box */}
            {isOpen && (
                <div className="space-y-3 pt-2 border-t border-sand-200">
                    {/* Search & Actions Bar */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-1.5">
                            <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik nama jalan, perumahan, atau gedung..."
                                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-sand-300 text-xs text-brand-950 placeholder-brand-400 focus:outline-hidden focus:border-brand-700"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="px-3.5 py-2 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'Cari'}
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={handleUseGPS}
                            disabled={isLocating}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
                        >
                            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                            <span>{isLocating ? 'Mendeteksi...' : 'GPS Saya'}</span>
                        </button>
                    </div>

                    {searchError && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{searchError}</span>
                        </div>
                    )}

                    {/* Leaflet Map Box */}
                    <div
                        ref={mapContainerRef}
                        className="w-full h-72 rounded-xl border border-sand-300 shadow-inner overflow-hidden z-0 relative"
                    />

                    {/* Footer Guide & Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-brand-600 px-1">
                        <div>
                            💡 <strong>Tips:</strong> Klik di peta atau geser pin merah untuk menandai posisi rumah.
                        </div>

                        {distanceKm !== null && (
                            <div className="font-semibold text-brand-950 bg-white px-2.5 py-1 rounded-md border border-sand-200">
                                Jarak: <strong className="text-rose-600">{distanceKm} km</strong> dari Roastery
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

