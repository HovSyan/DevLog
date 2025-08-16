import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [app.get(ConfigService).getOrThrow('KAFKA_BROKER')],
            },
            consumer: {
                groupId: 'posts-service',
            },
        },
    });
    await app.startAllMicroservices();
    await app.listen(app.get(ConfigService).getOrThrow<number>('PORT'));
}
bootstrap();
