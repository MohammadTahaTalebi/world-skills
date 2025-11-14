````md
## Environment Setup

.env
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
JWT_SECRET="your-secret"
PORT=3000
````

## Install

```bash
npm install
npx prisma generate
```

## Run (dev)

```bash
npm run dev
```

## Run (production)

```bash
npm start
```
