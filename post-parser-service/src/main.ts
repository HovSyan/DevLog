import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Transport } from '@nestjs/microservices/enums/transport.enum';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [configService.getOrThrow('KAFKA_BROKER')],
            },
            consumer: {
                groupId: 'post-parser',
            },
            subscribe: {
                fromBeginning: true,
            },
        },
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    await app.startAllMicroservices();
}
bootstrap();
