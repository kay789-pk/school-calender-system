# การ Deploy บน Vercel (แนะนำ)

## ทำไมต้อง Vercel?
✅ รองรับ Node.js + React
✅ รองรับ SQLite (ผ่าน Serverless Functions)
✅ Deploy ง่าย ไม่ต้องแก้โค้ด
✅ ฟรี 100GB bandwidth/เดือน
✅ HTTPS อัตโนมัติ

## ขั้นตอนการ Deploy:

### 1. สร้าง GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### 2. เข้า Vercel.com
- Login ด้วย GitHub
- Import โปรเจค
- Deploy อัตโนมัติ

### 3. ปรับแต่งเล็กน้อย
- เพิ่มไฟล์ `vercel.json`
- ปรับ package.json

## ไฟล์ vercel.json:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```