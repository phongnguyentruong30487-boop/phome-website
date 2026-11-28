@echo off
chcp 65001 >nul
cd /d "D:\001.CLAUDE CODE\2.phome-website\nextjs-app"
echo.
echo ================================================
echo   Dang mo Trang Quan Tri (sua gia / san pham / blog)
echo ================================================
echo.
echo Dung dong y nay lai khi dang sua du lieu.
echo Khi sua xong, dong cua so nay lai la duoc.
echo.
start "" http://localhost:3000
npx serve tools/admin
pause
