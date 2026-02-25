// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 10 * 1000 * 60,
        httpOnly: true,
        secure: false,
      },
    }),
  );

  app.use('/login-swagger', (req: Request, res: Response) => {
    if (req.method === 'GET') {
      return res.send(`
    <form method="POST" action="/login-swagger" style="max-width: 300px; margin: 100px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9; font-family: sans-serif;">
      <h2 style="text-align: center; margin-bottom: 20px;">Login</h2>
  
      <input
      type="text"
      name="username"
      placeholder="Username"
      autocomplete="username"
      autofocus
      style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 4px;"/>
  
      <input
      type="password"
      name="password"
      placeholder="Password"
      autocomplete="new-password"
      style="width: 100%; padding: 10px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px;" />
  
      <button
      type="submit"
      style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Login
      </button>
    </form>
      `);
    }

    const { username, password } = req.body;
    if (
      username === process.env.SWAGGER_USER &&
      password === process.env.SWAGGER_PASS
    ) {
      req.session['authenticated'] = true;

      return res.redirect('/api');
    }

    return res.status(401).json({ message: 'Unauthorized' });
  });

  app.use('/logout-swagger', (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.redirect('/login-swagger');
    });
  });

  // Protect Swagger routes
  app.use(
    ['/api', '/api-json'],
    (req: Request, res: Response, next: NextFunction) => {
      if (req.session['authenticated']) {
        next();
      } else {
        res.redirect('/login-swagger');
      }
    },
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Swagger Technical test Ambisius')
    .setDescription('Technical test Ambisius')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
