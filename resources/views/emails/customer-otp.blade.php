<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Masuk — Alat Kopi Malang</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f7f5f0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #2b2520;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 540px;
            margin: 36px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #ede8de;
        }
        .header {
            background-color: #1a1612;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            color: #f5eedf;
            margin: 0;
            font-size: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 800;
        }
        .header p {
            color: #bfa888;
            margin: 6px 0 0;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            padding: 36px 32px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 15px;
            margin-bottom: 16px;
            color: #2b2520;
        }
        .otp-box {
            background: #fbf9f5;
            border: 2px dashed #bfa888;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 28px 0;
        }
        .otp-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #7a6e62;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .otp-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #8c532b;
            margin: 4px 0;
        }
        .otp-validity {
            font-size: 12px;
            color: #9c8e7e;
            margin-top: 8px;
        }
        .note {
            background: #fff8eb;
            border-left: 4px solid #d97706;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 12px;
            color: #92400e;
            margin-top: 24px;
        }
        .footer {
            background: #f4efe6;
            padding: 20px 24px;
            text-align: center;
            font-size: 11px;
            color: #8c7e6f;
            border-top: 1px solid #ede8de;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Alat Kopi Malang</h1>
            <p>Jejak Rasa Lereng Gunung Kawi Malang</p>
        </div>
        <div class="content">
            <div class="greeting">
                Halo,<br>
                Kami menerima permintaan masuk akun menggunakan alamat email <strong>{{ $email }}</strong>.
            </div>

            <p style="font-size: 13px; color: #5c5246;">
                Silakan masukkan 6 digit kode konfirmasi One-Time Password (OTP) berikut pada halaman masuk website:
            </p>

            <div class="otp-box">
                <div class="otp-label">Kode Verifikasi Masuk</div>
                <div class="otp-code">{{ $otp }}</div>
                <div class="otp-validity">⏱ Berlaku selama 10 menit</div>
            </div>

            <div class="note">
                <strong>Penting:</strong> Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda. Tim Alat Kopi Malang tidak pernah meminta kode OTP Anda.
            </div>

            <p style="font-size: 12px; color: #8c7e6f; margin-top: 24px;">
                Jika Anda tidak merasa melakukan permintaan masuk akun ini, Anda dapat mengabaikan email ini dengan aman.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Alat Kopi Malang · Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Kota Malang<br>
            Kopi Spesialti Nusantara Berkualitas
        </div>
    </div>
</body>
</html>

