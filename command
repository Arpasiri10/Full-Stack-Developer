cd .\backend\
npm init -y
npm i nodemon
npm i
npx prisma init

npx prisma db pull
npx prisma generate
npx prisma migrate dev --name update_customers_schema
ตอบ y
npx nodemon npm start
``

----Package.json-----
