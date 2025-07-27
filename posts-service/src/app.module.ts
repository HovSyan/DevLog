import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_POSTGRES_CONNECTION_STRING } from './constants';

@Module({
    imports: [
        PostsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.getOrThrow(ENV_POSTGRES_CONNECTION_STRING),
                autoLoadEntities: true,
                synchronize: process.env.NODE_ENV !== 'production',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
