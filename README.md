# Create StackBuild

`create-stackbuild` คือ CLI สำหรับสร้างโปรเจกต์ full-stack แบบ monorepo ด้วยคำสั่ง `npm create stackbuild@latest my-project`

## สิ่งที่ต้องมี

- Node.js เวอร์ชัน 20 ขึ้นไป
- Go รุ่น stable ปัจจุบัน เมื่อต้องการเลือก backend แบบ Go + Gin
- Docker Compose v2 เมื่อต้องการเลือก Docker
- pnpm, npm, Yarn หรือ Bun ตาม package manager ที่เลือก

StackBuild ใช้เวอร์ชันที่ผ่านการทดสอบร่วมกันสำหรับ framework หลัก (เช่น Next.js, NestJS, TypeScript, Vite และ React) เพื่อให้โปรเจกต์ที่สร้างมีความเสถียร ส่วน Dependabot จะเสนอ PR อัปเดตทุกสัปดาห์ และ CI จะตรวจทุก template ก่อนนำเวอร์ชันใหม่มาใช้

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
| `--template` | ชื่อเดียวกับ `--preset` ใช้สำหรับระบุ template แบบไม่ต้องตอบคำถาม |
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
| `--dry-run` | แสดงแผนการสร้างโดยไม่เขียนไฟล์ |
| `--debug` | แสดงรายละเอียด error เพิ่มเติม |

ค่าที่ระบุผ่าน flags จะมีผลเหนือกว่าคำตอบจากหน้าคำถาม

ตัวอย่างตรวจแผนก่อนสร้าง:

```bash
npm create stackbuild@latest my-project -- \
  --template custom --apps customer,partner --frontend next --backend nest \
  --database postgres --cache redis --package-manager pnpm --dry-run
```

## หาก setup ไม่สำเร็จ

หากการติดตั้ง dependency หรือการตั้งค่า Go หยุดกลางทาง StackBuild จะเก็บไฟล์ที่สร้างแล้วไว้ และสร้าง `STACKBUILD_RECOVERY.md` ในโปรเจกต์ใหม่พร้อมคำสั่ง retry ที่ตรงกับ stack ที่เลือก

## การ publish สำหรับผู้ดูแลแพ็กเกจ

workflow GitHub Actions จะตรวจ typecheck, lint, tests และ generator matrix ทุกครั้งที่ push และทุกสัปดาห์ สำหรับการ publish ให้ตั้งค่า npm Trusted Publisher ให้เชื่อมกับ repository นี้และ workflow `Publish to npm`; เมื่อเผยแพร่ GitHub Release ที่มี tag รูปแบบ `v*` workflow จะ publish พร้อม npm provenance โดยไม่ต้องเก็บ npm token ใน GitHub Secrets
