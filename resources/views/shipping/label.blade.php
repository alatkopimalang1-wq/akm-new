<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipping Label AWB - {{ $order_number }}</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: #f1f5f9;
            color: #0f172a;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 12px;
        }

        .no-print {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 18px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            border: none;
            transition: all 0.15s ease;
            text-decoration: none;
        }

        .btn-print {
            background-color: #1e293b;
            color: #ffffff;
        }

        .btn-print:hover {
            background-color: #0f172a;
        }

        .btn-back {
            background-color: #e2e8f0;
            color: #1e293b;
        }

        /* Label Container (100mm x 150mm standard thermal sticker) */
        .label-container {
            width: 100mm;
            min-height: 145mm;
            background: #ffffff;
            border: 2px solid #000000;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            position: relative;
        }

        .header-table {
            width: 100%;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
        }

        .brand-title {
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .brand-sub {
            font-size: 9px;
            color: #475569;
        }

        .courier-badge {
            display: inline-block;
            background: #000000;
            color: #ffffff;
            font-size: 13px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: right;
        }

        .service-badge {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 2px;
            text-align: right;
        }

        /* AWB Section */
        .awb-section {
            text-align: center;
            border: 2px dashed #000000;
            padding: 8px 4px;
            margin-bottom: 8px;
            background: #fafafa;
        }

        .barcode-svg {
            width: 90%;
            height: 38px;
            margin: 0 auto 4px auto;
            display: block;
        }

        .awb-code {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 2px;
            font-family: "Courier New", Courier, monospace;
        }

        .order-ref {
            font-size: 10px;
            color: #334155;
            font-weight: 600;
        }

        /* Address Grid */
        .address-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            margin-bottom: 8px;
        }

        .sender-box {
            padding: 8px 6px;
            border-right: 1.5px solid #000;
            font-size: 10px;
            line-height: 1.35;
        }

        .recipient-box {
            padding: 8px 6px;
            font-size: 10px;
            line-height: 1.35;
        }

        .box-title {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 3px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 2px;
        }

        .person-name {
            font-size: 12px;
            font-weight: 900;
            color: #000000;
            margin-bottom: 2px;
        }

        .person-phone {
            font-size: 11px;
            font-weight: 800;
            margin-bottom: 4px;
        }

        .address-text {
            color: #1e293b;
        }

        /* Items Box */
        .items-section {
            border: 1px solid #000;
            padding: 6px;
            margin-bottom: 8px;
            font-size: 9.5px;
            line-height: 1.3;
        }

        .items-title {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 9px;
            margin-bottom: 4px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 2px;
        }

        .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }

        .item-name {
            font-weight: 700;
        }

        .item-spec {
            font-size: 8.5px;
            color: #475569;
        }

        /* Footer & Badges */
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            align-items: center;
            border-top: 1.5px solid #000;
            padding-top: 6px;
        }

        .status-badge {
            border: 2px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-weight: 900;
            font-size: 11px;
            text-transform: uppercase;
        }

        .fragile-box {
            border: 2px dashed #e11d48;
            color: #e11d48;
            font-weight: 900;
            font-size: 9.5px;
            text-align: center;
            padding: 4px;
            text-transform: uppercase;
            line-height: 1.2;
        }

        @media print {
            body {
                background: none;
                padding: 0;
            }

            .no-print {
                display: none !important;
            }

            .label-container {
                border: 2px solid #000;
                box-shadow: none;
                width: 100mm;
                height: 145mm;
                page-break-after: always;
                margin: 0;
            }

            @page {
                size: 100mm 150mm;
                margin: 0;
            }
        }
    </style>
</head>
<body>

    <div class="no-print">
        <button class="btn btn-print" onclick="window.print()">
            🖨️ Cetak Label Pengiriman
        </button>
        <button class="btn btn-back" onclick="window.close()">
            ✕ Tutup Jendela
        </button>
    </div>

    <div class="label-container">
        <!-- Header -->
        <div>
            <table class="header-table">
                <tr>
                    <td style="vertical-align: top;">
                        <div class="brand-title">ALAT KOPI MALANG</div>
                        <div class="brand-sub">Specialty Coffee Roastery in Malang</div>
                        <div style="font-size: 9px; font-weight: 600; margin-top: 2px;">Tgl: {{ $created_at }}</div>
                    </td>
                    <td style="text-align: right; vertical-align: top;">
                        <div class="courier-badge">{{ $courier }}</div>
                        <div class="service-badge">{{ $service }} · {{ $weight_kg }} kg</div>
                    </td>
                </tr>
            </table>

            <!-- Air Waybill (AWB) Barcode -->
            <div class="awb-section">
                <!-- Barcode SVG generator -->
                <svg class="barcode-svg" viewBox="0 0 200 40">
                    <rect x="5" y="0" width="3" height="40" fill="#000"/>
                    <rect x="12" y="0" width="2" height="40" fill="#000"/>
                    <rect x="18" y="0" width="4" height="40" fill="#000"/>
                    <rect x="26" y="0" width="2" height="40" fill="#000"/>
                    <rect x="32" y="0" width="5" height="40" fill="#000"/>
                    <rect x="40" y="0" width="2" height="40" fill="#000"/>
                    <rect x="46" y="0" width="3" height="40" fill="#000"/>
                    <rect x="54" y="0" width="4" height="40" fill="#000"/>
                    <rect x="62" y="0" width="2" height="40" fill="#000"/>
                    <rect x="68" y="0" width="4" height="40" fill="#000"/>
                    <rect x="76" y="0" width="2" height="40" fill="#000"/>
                    <rect x="82" y="0" width="5" height="40" fill="#000"/>
                    <rect x="90" y="0" width="3" height="40" fill="#000"/>
                    <rect x="96" y="0" width="2" height="40" fill="#000"/>
                    <rect x="102" y="0" width="4" height="40" fill="#000"/>
                    <rect x="110" y="0" width="2" height="40" fill="#000"/>
                    <rect x="116" y="0" width="5" height="40" fill="#000"/>
                    <rect x="124" y="0" width="3" height="40" fill="#000"/>
                    <rect x="130" y="0" width="4" height="40" fill="#000"/>
                    <rect x="138" y="0" width="2" height="40" fill="#000"/>
                    <rect x="144" y="0" width="4" height="40" fill="#000"/>
                    <rect x="152" y="0" width="3" height="40" fill="#000"/>
                    <rect x="158" y="0" width="2" height="40" fill="#000"/>
                    <rect x="164" y="0" width="5" height="40" fill="#000"/>
                    <rect x="172" y="0" width="2" height="40" fill="#000"/>
                    <rect x="178" y="0" width="4" height="40" fill="#000"/>
                    <rect x="186" y="0" width="3" height="40" fill="#000"/>
                    <rect x="192" y="0" width="2" height="40" fill="#000"/>
                </svg>
                <div class="awb-code">{{ $awb }}</div>
                <div class="order-ref">No. Pesanan: #{{ $order_number }}</div>
            </div>

            <!-- Address Grid: Sender & Recipient -->
            <div class="address-grid">
                <div class="sender-box">
                    <div class="box-title">PENGIRIM (FROM)</div>
                    <div class="person-name">{{ $sender['name'] }}</div>
                    <div class="person-phone">📞 {{ $sender['phone'] }}</div>
                    <div class="address-text">{{ $sender['address'] }}</div>
                </div>

                <div class="recipient-box">
                    <div class="box-title">PENERIMA (TO)</div>
                    <div class="person-name">{{ $recipient['name'] }}</div>
                    <div class="person-phone">📞 {{ $recipient['phone'] }}</div>
                    <div class="address-text">
                        {{ $recipient['address'] }}
                        @if(!empty($recipient['district']))
                            <br><strong>Kec. {{ $recipient['district'] }}</strong>
                        @endif
                        @if(!empty($recipient['city']))
                            , {{ $recipient['city'] }}
                        @endif
                        @if(!empty($recipient['postal_code']))
                            - {{ $recipient['postal_code'] }}
                        @endif
                    </div>
                    @if(!empty($recipient['notes']))
                        <div style="font-size: 8.5px; color: #b91c1c; margin-top: 3px; font-weight: 600;">
                            Catatan: {{ $recipient['notes'] }}
                        </div>
                    @endif
                </div>
            </div>

            <!-- Items Summary -->
            <div class="items-section">
                <div class="items-title">DAFTAR ISI PAKET ({{ count($items) }} ITEM · {{ $weight_kg }} KG)</div>
                @foreach($items as $item)
                    <div class="item-row">
                        <div>
                            <span class="item-name">• {{ $item['name'] }}</span>
                            <span class="item-spec">({{ $item['variant'] }} · {{ $item['grind'] }})</span>
                            @if(!empty($item['custom_notes']))
                                <div style="font-size: 8px; color: #374151; white-space: pre-line; margin-top: 2px;">{{ $item['custom_notes'] }}</div>
                            @endif
                        </div>
                        <div style="font-weight: 800;">x{{ $item['qty'] }}</div>
                    </div>
                @endforeach
            </div>
        </div>

        <!-- Footer -->
        <div class="footer-grid">
            <div class="status-badge">
                {{ $payment_status }}
            </div>
            <div class="fragile-box">
                ⚠️ FRAGILE / JANGAN DIBANTING<br>
                PRODUK KOPI SPESIALTI
            </div>
        </div>
    </div>

</body>
</html>

