import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INJECTION_TOKENS } from 'src/constants';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        AuthModule,
        ClientsModule.registerAsync([
            {
                name: INJECTION_TOKENS.KAFKA_CLIENT,
                useFactory: (configService: ConfigService) => {
                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                brokers: [
                                    configService.getOrThrow('KAFKA_BROKER'),
                                ],
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                            },
                        },
                    };
                },
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
