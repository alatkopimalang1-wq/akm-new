@echo off
cd /d "%~dp0"
title Website Alat Kopi Malang (AKM)
echo ========================================================
echo   MENYIAPKAN WEBSITE ALAT KOPI MALANG (AKM)
echo ========================================================
echo.
echo 1. Memulai server website...
start /b "" npm.cmd run dev
timeout /t 3 /nobreak >nul
echo 2. Membuka website di browser...
start http://localhost:5173
echo.
echo ========================================================
echo   BERHASIL! Website aktif di: http://localhost:5173
echo   (Biarkan jendela hitam ini tetap terbuka saat memakai web)
echo ========================================================
echo.
echo Tekan sembarang tombol jika ingin menutup server...
pause >nul
