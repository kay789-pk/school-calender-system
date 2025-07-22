# การ Deploy โปรเจคบน Firebase

## ขั้นตอนการเตรียม Firebase

### 1. ติดตั้ง Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login Firebase
```bash
firebase login
```

### 3. สร้าง Firebase Project
```bash
firebase init
```

### 4. เลือกบริการที่ต้องการ:
- ✅ Hosting (สำหรับ React App)
- ✅ Functions (สำหรับ Backend API)
- ✅ Firestore (แทน SQLite)

## การปรับแต่งโปรเจค

### Frontend (React)
- Build React App: `npm run build`
- Deploy ไปยัง Firebase Hosting

### Backend (Node.js)
- ย้ายจาก Express Server ไป Firebase Functions
- เปลี่ยนจาก SQLite เป็น Firestore
- ปรับ API endpoints

### Database
- ย้ายข้อมูลจาก SQLite ไป Firestore
- ปรับ queries ให้เข้ากับ NoSQL

## ข้อดีของ Firebase:
✅ Auto-scaling
✅ HTTPS ฟรี
✅ CDN Global
✅ Authentication ในตัว
✅ Real-time Database

## ข้อเสียของ Firebase:
❌ ต้องเขียนโค้ดใหม่ส่วนใหญ่
❌ จำกัดด้วย Firebase ecosystem
❌ ค่าใช้จ่ายเมื่อใช้งานมาก