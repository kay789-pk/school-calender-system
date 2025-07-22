@echo off
echo ========================================
echo ระบบปฏิทินงานโรงเรียนซับใหญ่วิทยาคม
echo ========================================
echo.

echo กำลังติดตั้ง Dependencies สำหรับ Server...
call npm install

echo.
echo กำลังติดตั้ง Dependencies สำหรับ Client...
cd client
call npm install

echo.
echo การติดตั้งเสร็จสิ้น!
echo.
echo วิธีการใช้งาน:
echo 1. รันคำสั่ง: npm run dev
echo 2. เปิดเบราว์เซอร์ไปที่: http://localhost:3000
echo.
echo บัญชีทดสอบ:
echo - ผู้ดูแลระบบ: admin / admin123
echo - ครู: teacher / teacher123  
echo - นักเรียน: student / student123
echo.
pause