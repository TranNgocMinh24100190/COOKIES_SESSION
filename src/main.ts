import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser('my-secret-key'));
  app.use(
    session({
      secret: 'my-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000, httpOnly: true },
    }),
  );

  await app.listen(3000);
  console.log(`Ứng dụng đang chạy tại: http://localhost:3000`);
}
void bootstrap(); // Thêm chữ void vào đây
