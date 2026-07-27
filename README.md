# Create StackBuild

`create-stackbuild` คือ CLI สำหรับสร้างโปรเจกต์ full-stack แบบ monorepo ด้วยคำสั่ง `npm create stackbuild@latest my-project`

## สิ่งที่ต้องมี

- Node.js เวอร์ชัน 20 ขึ้นไป
- Go เมื่อต้องการเลือก backend แบบ Go + Gin

## สร้างโปรเจกต์

ระบุชื่อโฟลเดอร์ของโปรเจกต์ต่อท้ายคำสั่ง:

```bash
npm create stackbuild@latest my-project
```

จากนั้น StackBuild จะถามเพื่อกำหนดโปรเจกต์ตามลำดับดังนี้:

1. **รูปแบบแอป**
   - Customer + API + Admin + Partner
   - Customer + API + Partner
   - Customer + API + Admin
   - Customer + API
   - Custom — เลือก frontend ที่ต้องการเอง โดยมี API เสมอ
2. **Frontend** — Vite หรือ Next.js
3. **Backend** — Go + Gin หรือ Node.js + NestJS
4. **UI** — Material UI, Tailwind CSS หรือ Plain CSS
5. **Database** — PostgreSQL, MySQL, SQLite หรือไม่ใช้ฐานข้อมูล
6. **Cache** — หลังเลือกฐานข้อมูล จะเลือก `Use Redis cache` หรือ `No cache`
7. **Package manager** — pnpm (ค่าเริ่มต้นสำหรับ monorepo), npm, yarn หรือ bun
8. **Docker** — เลือกว่าจะให้สร้างไฟล์ Docker หรือไม่

เมื่อยืนยันคำตอบ CLI จะสร้างโปรเจกต์ตามตัวเลือกที่เลือกไว้ และติดตั้ง dependencies ให้โดยอัตโนมัติ

## สร้างด้วยค่าที่กำหนดผ่านคำสั่ง

สามารถข้ามหน้าคำถามด้วย flags ได้ โดยต้องใส่ `--` ก่อน flags เพื่อส่งต่อให้ StackBuild:

```bash
npm create stackbuild@latest my-project -- \
  --preset customer-admin \
  --frontend vite \
  --backend go \
  --ui mui \
  --database postgres \
  --cache redis \
  --package-manager pnpm \
  --docker
```

| Flag | ค่าที่ใช้ได้ / ความหมาย |
| --- | --- |
| `--preset` | `full`, `customer-partner`, `customer-admin`, `customer-api` หรือ `custom` |
| `--apps` | รายชื่อ frontend คั่นด้วย comma สำหรับ `--preset custom` เช่น `customer,partner` |
| `--frontend` | `vite` หรือ `next` |
| `--backend` | `go` หรือ `nest` |
| `--ui` | `mui`, `tailwind` หรือ `css` |
| `--database` | `postgres`, `mysql`, `sqlite` หรือ `none` |
| `--cache` | `redis` หรือ `none` |
| `--package-manager` | `pnpm`, `npm`, `yarn` หรือ `bun` |
| `--go-module` | Go module path เมื่อเลือก `--backend go` |
| `--skip-install` | สร้างไฟล์โดยไม่ติดตั้ง dependencies |
| `--no-git` | ไม่สร้าง Git repository ในโปรเจกต์ใหม่ |
| `--docker` / `--no-docker` | เปิดหรือปิดการสร้างไฟล์ Docker |
| `--force` | อนุญาตให้สร้างในโฟลเดอร์ที่มีไฟล์อยู่แล้ว |
| `--debug` | แสดงรายละเอียด error เพิ่มเติม |

ค่าที่ระบุผ่าน flags จะมีผลเหนือกว่าคำตอบจากหน้าคำถาม
