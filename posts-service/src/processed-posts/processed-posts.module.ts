import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { INJECTION_TOKENS } from 'src/constants';
import { ProcessedPostsController } from './processed-posts.controller';
import { ParsedPostsService } from './processed-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Post } from 'src/posts/entities/post.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
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
                        },
                    };
                },
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [ProcessedPostsController],
    providers: [ParsedPostsService],
})
export class ProcessedPostsModule {}
