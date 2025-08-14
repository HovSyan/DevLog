import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PostProcessEventDto } from './dto/post-process-event.dto';
import { INCOMING_EVENTS } from './constants';

@Controller()
export class AppController {
    private _logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @EventPattern([INCOMING_EVENTS.POST_UPDATED, INCOMING_EVENTS.POST_CREATED])
    handlePostUpdated(@Payload() data: PostProcessEventDto) {
        this._logger.log(`Received post event: ${JSON.stringify(data)}`);
        this.appService.processPostData(data);
        this._logger.log(
            `Post event processed successfully.
            Markdown: ${data.post.contentMarkdown}
            HTML: ${data.post.contentHTML}`,
        );
    }
}
