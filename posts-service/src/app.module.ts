import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PostsModule,
        // TODO: Make configuration validation
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                database: config.getOrThrow('POSTGRES_DB'),
                username: config.getOrThrow('POSTGRES_USER'),
                password: config.getOrThrow('POSTGRES_PASSWORD'),
                port: config.getOrThrow('POSTGRES_PORT'),
                host: config.getOrThrow('POSTGRES_HOST'),
                autoLoadEntities: true,
                migrationsRun: true,
                logging: config.get('NODE_ENV') === 'development',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
