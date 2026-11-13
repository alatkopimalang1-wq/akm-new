<div class="space-y-4 text-sm text-gray-800 dark:text-gray-200">
    @if (! empty($tracking['success']))
        {{-- Header Status Card --}}
        <div class="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
                <div>
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ekspedisi</span>
                    <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ $tracking['courier_name'] ?? $order->shipping_courier }}</h4>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nomor Resi (AWB)</span>
                    <p class="font-mono text-base font-bold text-primary-600 dark:text-primary-400">{{ $tracking['waybill'] ?? $order->tracking_number }}</p>
                </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold {{ ($tracking['delivered'] ?? false) ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' }}">
                        {{ $tracking['status'] ?? 'ON PROCESS' }}
                    </span>
                    <span class="text-xs text-gray-600 dark:text-gray-400">{{ $tracking['status_label'] ?? '' }}</span>
                </div>
                <span class="text-xs text-gray-500">Gateway: {{ $tracking['provider'] ?? 'RajaOngkir Pro' }}</span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3 text-xs dark:border-gray-800">
                <div>
                    <span class="text-gray-500">Pengirim:</span>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $tracking['shipper'] ?? 'Alat Kopi Malang' }}</p>
                </div>
                <div>
                    <span class="text-gray-500">Penerima:</span>
                    <p class="font-semibold text-gray-900 dark:text-white">{{ $tracking['receiver'] ?? $order->customer_name }}</p>
                </div>
            </div>
        </div>

        {{-- Tracking Timeline --}}
        <div>
            <h5 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Riwayat Pengiriman Paket (Manifest)</h5>
            @if (! empty($tracking['history']) && count($tracking['history']) > 0)
                <div class="relative space-y-4 border-l-2 border-primary-500/30 pl-4 ml-2">
                    @foreach ($tracking['history'] as $idx => $event)
                        <div class="relative">
                            <span class="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 {{ $idx === 0 ? 'bg-primary-600' : 'bg-gray-400' }}"></span>
                            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ $event['date'] ?? '' }}</div>
                            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ $event['desc'] ?? '' }}</div>
                            @if (! empty($event['location']))
                                <div class="text-xs text-primary-600 dark:text-primary-400">📍 {{ $event['location'] }}</div>
                            @endif
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-xs text-gray-500 italic">Belum ada riwayat update scan fisik dari kurir.</p>
            @endif
        </div>
    @else
        <div class="rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 text-xs">
            {{ $tracking['message'] ?? 'Data tracking belum tersedia untuk nomor resi ini.' }}
        </div>
    @endif
</div>

