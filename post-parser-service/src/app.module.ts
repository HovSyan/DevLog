import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'POST_PARSER_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
                    },
                    consumer: {
                        groupId: 'post-parser-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
