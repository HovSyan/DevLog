import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                database: config.getOrThrow('POSTGRES_DB'),
                username: config.getOrThrow('POSTGRES_USER'),
                password: config.getOrThrow('POSTGRES_PASSWORD'),
                port: config.getOrThrow('POSTGRES_PORT'),
                host: config.getOrThrow('POSTGRES_HOST'),
                autoLoadEntities: true,
                logging: config.get('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DbModule {}
