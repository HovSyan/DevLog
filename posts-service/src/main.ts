import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_PORT } from './constants';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    await app.listen(
        app.get(ConfigService).get<number>('ENV_PORT') || DEFAULT_PORT,
    );
}
bootstrap();
