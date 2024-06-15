# Awesome Project Build with TypeORM

Steps to run this project:

npx typeorm init --database postgres --express

create docker compose file

docker compose up -d

atur environment pada typeorm

buat entity, helper, middleware, controller serta router

setelah itu, buat file migrasi dengan command:
- `npx typeorm migration:create ./src/migrations/users` (jika tidak install typeorm secara global)

setelah itu, migrasi dengan tampahkan script berikut:
- `"typeorm": "typeorm-ts-node-commonjs"`,

- `"migration": " npm run typeorm migration:run -- -d ./src/data-source.ts"`


1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command


Reference: https://medium.com/@christianinyekaka/building-a-rest-api-with-typescript-express-typeorm-authentication-authorization-and-postgres-e87d07d1af08