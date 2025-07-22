@echo off
echo ========================================
echo รีเซ็ตฐานข้อมูลระบบปฏิทินงาน
echo ========================================
echo.

echo กำลังลบฐานข้อมูลเก่า...
if exist school_calendar.db (
    del school_calendar.db
    echo ลบฐานข้อมูลเก่าเรียบร้อย
) else (
    echo ไม่พบฐานข้อมูลเก่า
)

echo.
echo กำลังเริ่มต้น Server เพื่อสร้างฐานข้อมูลใหม่...
echo รอสักครู่...
echo.

timeout /t 3 /nobreak > nul

echo ฐานข้อมูลใหม่จะถูกสร้างขึ้นเมื่อ Server เริ่มทำงาน
echo กรุณารัน start.bat เพื่อเริ่มระบบ
echo.
echo บัญชีทดสอบ:
echo - admin / admin123
echo - teacher / teacher123
echo - student / student123
echo.
pause