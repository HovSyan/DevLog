import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INJECTIONS_TOKENS } from './constants';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
        }),
        ClientsModule.registerAsync([
            {
                name: INJECTIONS_TOKENS.KAFKA_CLIENT,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: [configService.getOrThrow('KAFKA_BROKER')],
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
