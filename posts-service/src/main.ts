import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { useContainer } from 'class-validator';
import { AppGlobalExceptionFilter } from './app.exception-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.useGlobalFilters(new AppGlobalExceptionFilter());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // TODO: fix autoconnect in dev mode
    // app.connectMicroservice({
    //     transport: Transport.KAFKA,
    //     options: {
    //         client: {
    //             brokers: [app.get(ConfigService).getOrThrow('KAFKA_BROKER')],
    //         },
    //         consumer: {
    //             groupId: 'posts-service',
    //         },
    //     },
    // });
    await app.startAllMicroservices();
    await app.listen(app.get(ConfigService).getOrThrow<number>('PORT'));
}
bootstrap();
