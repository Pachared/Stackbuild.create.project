# Create StackBuild

`create-stackbuild` คือ CLI สำหรับสร้างโปรเจกต์ full-stack แบบ monorepo ผ่านคำถามแบบ interactive หรือกำหนดค่าผ่าน command flags ได้ในครั้งเดียว เหมาะสำหรับโปรเจกต์ที่มีหลาย frontend เช่น customer, admin และ partner ร่วมกับ API, shared packages, ฐานข้อมูล และ Docker

## สิ่งที่ต้องมี

- Node.js เวอร์ชัน 20 ขึ้นไป
- Go เมื่อต้องการเลือก backend แบบ Go + Gin

## เริ่มใช้งาน

สร้างโปรเจกต์ใหม่และตอบคำถามทีละขั้น:

```bash
npm create stackbuild@latest
```

กำหนดชื่อโปรเจกต์ตั้งแต่ต้น:

```bash
npm create stackbuild@latest my-project
```

หรือใช้ `npx`:

```bash
npx create-stackbuild@latest my-project
```

หลังจากรัน CLI จะเลือกได้ว่าจะสร้างชุดแอปแบบใด:

- Customer + API + Admin + Partner
- Customer + API + Partner
- Customer + API + Admin
- Customer + API
- Custom — เลือก frontend เอง โดย API จะถูกสร้างเสมอ

## กำหนดค่าผ่านคำสั่ง

สามารถข้ามหน้าคำถามด้วย flags ได้ เช่น:

```bash
npm create stackbuild@latest my-project -- \
  --preset customer-admin \
  --frontend vite \
  --backend go \
  --ui mui \
  --database postgres \
  --package-manager npm \
  --docker
```

ต้องใส่ `--` ก่อน flags เมื่อใช้ `npm create` เพื่อส่ง flags ต่อให้ StackBuild แทนที่จะถูก npm อ่านเอง

| Flag | ความหมาย |
| --- | --- |
| `--preset` | `full`, `customer-partner`, `customer-admin`, `customer-api` หรือ `custom` |
| `--frontend` | `vite` หรือ `next` |
| `--backend` | `go` หรือ `nest` |
| `--ui` | `mui`, `tailwind` หรือ `css` |
| `--database` | `postgres`, `mysql`, `sqlite` หรือ `none` |
| `--package-manager` | `npm`, `pnpm`, `yarn` หรือ `bun` |
| `--skip-install` | สร้างไฟล์โดยไม่ติดตั้ง dependencies |
| `--no-git` | ไม่สร้าง Git repository ในโปรเจกต์ใหม่ |
| `--docker` / `--no-docker` | เปิดหรือปิดการสร้าง Docker files |
| `--force` | อนุญาตให้สร้างในโฟลเดอร์ที่มีไฟล์อยู่แล้ว |
| `--debug` | แสดงรายละเอียด error เพิ่มเติม |

ค่าที่ระบุผ่าน flags จะมีผลเหนือกว่าคำตอบจากหน้าคำถาม

## Stack ที่รองรับ

- Frontend: React + TypeScript + Vite หรือ Next.js + TypeScript + App Router
- Backend: Go + Gin หรือ Node.js + NestJS
- UI: Material UI, Tailwind CSS หรือ Plain CSS
- Database: PostgreSQL, MySQL, SQLite หรือไม่ใช้ฐานข้อมูล

## โครงสร้างที่สร้างขึ้น

```text
my-project/
├── apps/
│   ├── customer/       # สร้างเฉพาะเมื่อเลือก
│   ├── admin/          # สร้างเฉพาะเมื่อเลือก
│   ├── partner/        # สร้างเฉพาะเมื่อเลือก
│   └── api/
├── packages/
│   ├── config/
│   ├── eslint-config/
│   ├── types/
│   ├── ui/
│   └── utils/
├── docker-compose.yml  # มีเมื่อเลือก Docker
└── package.json
```

แต่ละ frontend จะมีโครงสร้างสำหรับ `components`, `features`, `hooks`, `services`, `stores`, `styles`, `types` และ `utils` พร้อมไฟล์ตั้งต้น API จะมี health endpoint ที่ `GET /health` และ `GET /api/v1/status`

## คำสั่งหลังสร้างโปรเจกต์

```bash
cd my-project
npm install       # จำเป็นเมื่อเลือก --skip-install
npm run dev       # รันทุกแอปที่เลือก
npm run build     # build ทุกแอปที่เลือก
npm run lint
npm run format
```

หากเลือก Docker:

```bash
docker compose up --build
```

## การพัฒนา CLI

```bash
npm install
npm run build
npm test
```

## การเผยแพร่บน npm

อัปเดต version ใน `package.json` จากนั้น build และตรวจไฟล์ที่จะถูก publish:

```bash
npm run build
npm pack --dry-run
npm publish
```

ต้องล็อกอิน npm ด้วยบัญชีที่มีสิทธิ์ก่อนใช้ `npm publish`

## ปัญหาที่พบบ่อยและการร่วมพัฒนา

ใช้ `--debug` เพื่อดูสาเหตุ error แบบละเอียด ตรวจให้แน่ใจว่าใช้ Node.js 20+ และติดตั้ง Go ก่อนเลือก Go + Gin

หากต้องการร่วมพัฒนา ให้สร้าง branch ของตนเอง เพิ่มหรือปรับ test ตามการเปลี่ยนแปลง รัน build และ tests ให้ผ่านก่อนเปิด pull request
