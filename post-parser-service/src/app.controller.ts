import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafkaProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private _c: ClientKafkaProxy,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
