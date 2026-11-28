@echo off
chcp 65001 >nul
cd /d "%~dp0.."
echo.
echo ================================================
echo   Dang kiem tra va dua thay doi len website that
echo ================================================
echo.
echo Buoc 1/3: Kiem tra build thu (phat hien loi neu co)...
call npm run build
if errorlevel 1 (
  echo.
  echo !!! BUILD LOI !!! Website CHUA duoc cap nhat.
  echo Hay chup man hinh loi tren va gui lai de kiem tra.
  pause
  exit /b 1
)

echo.
echo Buoc 2/3: Luu thay doi (git commit)...
git add -A
git commit -m "Cap nhat du lieu (gia/san pham/blog) - %date% %time%"
if errorlevel 1 (
  echo Khong co thay doi moi de luu, hoac da luu truoc do.
)

echo.
echo Buoc 3/3: Day len GitHub de Cloudflare tu dong cap nhat website...
git push
if errorlevel 1 (
  echo.
  echo !!! DAY LEN GITHUB THAT BAI !!!
  echo Co the ban chua dang nhap git, hoac mat mang. Gui lai loi tren de kiem tra.
  pause
  exit /b 1
)

echo.
echo ================================================
echo   XONG! Cloudflare se tu dong build va cap nhat
echo   website that trong vai phut toi.
echo ================================================
pause
