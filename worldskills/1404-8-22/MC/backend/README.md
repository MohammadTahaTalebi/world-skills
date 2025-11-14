# MC Backend – نسخه Express.js

این فولدر یک پورت ساده‌شده از پروژه NestJS شما به **Express.js + Prisma + PostgreSQL (NeonDB)** است.

## ۱. پیش‌نیازها

- Node.js نسخه ۱۸ به بالا
- npm یا yarn
- یک دیتابیس PostgreSQL روی **NeonDB**

## ۲. ساخت دیتابیس روی NeonDB

1. وارد سایت Neon بشوید و یک پروژه جدید بسازید.
2. یک دیتابیس بسازید (مثلاً `neondb`).
3. از قسمت connection string، مقدار **PostgreSQL connection string** را کپی کن.
   - معمولاً چیزی شبیه این است:

      `postgres://USER:PASSWORD@ep-xxxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

4. همین مقدار را در متغیر `DATABASE_URL` در فایل `.env` قرار بده.

## ۳. تنظیم `.env`

در روت همین پروژه (mc-backend-express):

```bash
cp .env.example .env
```

بعد فایل `.env` را باز کن و مقدارها را ست کن:

```env
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_SECRET="یک-رشته-تصادفی-قوی"
PORT=3000
```

## ۴. نصب پکیج‌ها و Prisma

```bash
npm install
npx prisma generate
# در صورت نیاز
npx prisma migrate dev --name init
```

> اسکیمای Prisma همان اسکیمای قبلی پروژه است، فقط generator طوری تنظیم شده که
> کلاینت را به صورت پکیج `@prisma/client` بسازد.

## ۵. ران کردن پروژه از صفر

1. مطمئن شو PostgreSQL / NeonDB آماده است و `DATABASE_URL` درست ست شده.
2. کامند زیر را اجرا کن:

   ```bash
   npm run dev
   ```

   یا:

   ```bash
   npm start
   ```

3. حالا API روی آدرس زیر بالا است:

   - `http://localhost:3000/`

## ۶. روت‌های اصلی

### Auth

- `POST /auth/signup`  
  بدنه:

  ```json
  {
    "username": "testuser",
    "password": "secret123"
  }
  ```

- `POST /auth/signin`
- `POST /auth/signin-admin`

همه‌ی این روت‌ها در جواب یک آبجکت شبیه زیر برمی‌گردانند:

```json
{
  "access_token": "JWT_TOKEN_HERE"
}
```

### Users

> همه‌ی این روت‌ها نیاز به هدر `Authorization: Bearer <token>` دارند  
> و حتماً باید یوزر در جدول `AdminUser` وجود داشته باشد.

- `GET /users` – لیست تمام `PlatformUser` ها
- `GET /users/admins` – لیست تمام ادمین‌ها

### Games

- `POST /games` (نیاز به توکن – فقط user با role = developer)
- `GET /games` (پابلیک، با query های `page` ،`size` ،`sortDir`)
- `GET /games/:slug`
- `PUT /games/:slug`
- `DELETE /games/:slug` (نیاز به توکن – فقط admin)
- `GET /games/:slug/scores`
- `POST /games/:slug/scores` (نیاز به توکن – هر `PlatformUser` مجاز)

## ۷. فرق‌های مهم با نسخه NestJS

- همه‌چیز در یک Express app ساده پیاده‌سازی شده (`src/index.js`).
- ساختار پوشه‌ها خواناتر شده است:
  - `src/routes` برای روت‌ها
  - `src/middleware` برای middleware ها
  - `src/lib/prisma.js` برای اتصال Prisma
- دیتابیس همان Postgres + Prisma است، فقط برای استفاده راحت‌تر با **NeonDB** تنظیم شده.

اگر خواستی می‌توانی این فولدر را جداگانه در یک ریپو جدید قرار بدهی و مستقیم با آن کار کنی.
