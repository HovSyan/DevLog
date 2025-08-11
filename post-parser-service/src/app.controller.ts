import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
    private _logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern('posts.created')
    @EventPattern('posts.updated')
    handlePostUpdated(data: any) {
        this._logger.log(`Received post event: ${JSON.stringify(data)}`);
    }
}
