# ระบบปฏิทินงานโรงเรียนซับใหญ่วิทยาคม

ระบบปฏิทินงานและกิจกรรมสำหรับโรงเรียนซับใหญ่วิทยาคม ที่ช่วยให้ผู้บริหาร ครู และนักเรียน สามารถติดตามกิจกรรมต่างๆ ของโรงเรียนได้อย่างมีประสิทธิภาพ

## คุณสมบัติหลัก

### 📅 การจัดการปฏิทิน
- แสดงปฏิทินรายเดือนพร้อมกิจกรรมต่างๆ
- ระบบสีแยกประเภทกิจกรรม
- ดูรายละเอียดกิจกรรมแบบ popup
- กรองกิจกรรมตามประเภทและกลุ่มเป้าหมาย

### 🎯 การจัดการกิจกรรม
- เพิ่ม/แก้ไข/ลบ กิจกรรม (ตามสิทธิ์ผู้ใช้)
- กำหนดวันเวลา สถานที่ ผู้รับผิดชอบ
- จัดประเภทกิจกรรม: วิชาการ, นักเรียน, ภายนอก, ประชุม, สอบ
- กำหนดกลุ่มเป้าหมาย: ผู้บริหาร, ครู, นักเรียน, ทุกคน

### 🔍 การค้นหาและกรอง
- ค้นหากิจกรรมตามชื่อ รายละเอียด หรือสถานที่
- กรองตามประเภทกิจกรรม
- กรองตามกลุ่มเป้าหมาย
- กรองตามเดือน

### 👥 ระบบผู้ใช้งาน
- **ผู้ดูแลระบบ**: เพิ่ม/แก้ไข/ลบ กิจกรรมได้ทั้งหมด
- **ครู**: เพิ่ม/แก้ไข กิจกรรมได้
- **นักเรียน**: ดูกิจกรรมเท่านั้น

### 📊 การติดตามประวัติ
- บันทึกประวัติการเพิ่ม/แก้ไข/ลบ กิจกรรม
- ระบบ Authentication ด้วย JWT
- ข้อมูลถาวรใน SQLite Database

## เทคโนโลยีที่ใช้

### Frontend
- **React 18** - UI Framework
- **CSS3** - Styling พร้อมธีมสีเขียว-เหลือง
- **Font Awesome** - Icons
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## การติดตั้งและใช้งาน

### ข้อกำหนดระบบ
- Node.js 16+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **ติดตั้ง Dependencies**
```bash
npm run install-all
```

2. **เริ่มต้นระบบ**
```bash
npm run dev
```

3. **เข้าใช้งานระบบ**
- เปิดเบราว์เซอร์ไปที่: http://localhost:3000
- Server API: http://localhost:5000

### บัญชีทดสอบ

| บทบาท | ชื่อผู้ใช้ | รหัสผ่าน | สิทธิ์ |
|--------|-----------|----------|--------|
| ผู้ดูแลระบบ | admin | admin123 | เพิ่ม/แก้ไข/ลบ ทั้งหมด |
| ครู | teacher | teacher123 | เพิ่ม/แก้ไข กิจกรรม |
| นักเรียน | student | student123 | ดูกิจกรรมเท่านั้น |

## โครงสร้างโปรเจค

```
school-calendar-system/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── Login.js
│   │   │   ├── Header.js
│   │   │   ├── Calendar.js
│   │   │   ├── EventForm.js
│   │   │   └── EventList.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Node.js Backend
│   └── server.js
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/login` - เข้าสู่ระบบ

### Events
- `GET /api/events` - ดึงรายการกิจกรรม
- `POST /api/events` - เพิ่มกิจกรรมใหม่
- `PUT /api/events/:id` - แก้ไขกิจกรรม
- `DELETE /api/events/:id` - ลบกิจกรรม
- `GET /api/events/:id/history` - ดูประวัติการแก้ไข

## ฟีเจอร์เพิ่มเติมที่สามารถพัฒนาได้

- 📧 ระบบแจ้งเตือนทาง Email
- 📱 Responsive Design สำหรับมือถือ
- 📄 Export ปฏิทินเป็น PDF
- 🔔 ระบบแจ้งเตือนแบบ Real-time
- 📊 Dashboard และรายงาน
- 🌐 Multi-language Support
- 📅 การซิงค์กับ Google Calendar

## การพัฒนาและปรับแต่ง

### การเพิ่มประเภทกิจกรรมใหม่
แก้ไขไฟล์ `server/server.js` ในส่วน `event_type` CHECK constraint และอัพเดท frontend components

### การเปลี่ยนธีมสี
แก้ไขไฟล์ `client/src/index.css` ในส่วน CSS variables และ color schemes

### การเพิ่มฟิลด์ข้อมูล
1. แก้ไข database schema ใน `server/server.js`
2. อัพเดท API endpoints
3. แก้ไข React components

## การสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา

---

**พัฒนาโดย:** ทีมพัฒนาระบบสารสนเทศ  
**สำหรับ:** โรงเรียนซับใหญ่วิทยาคม  
**เวอร์ชัน:** 1.0.0