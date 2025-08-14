import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { KAFKA_TOPICS } from 'src/constants';
import { PostProcessedEventDto } from 'src/posts/dto/post-processed-event.dto';
import { ParsedPostsService } from './processed-posts.service';

@Controller()
export class ProcessedPostsController {
    constructor(private readonly _processedPostsService: ParsedPostsService) {}

    @EventPattern(KAFKA_TOPICS.POST_PROCESSED)
    handlePostProcessed(@Payload() event: PostProcessedEventDto) {
        return this._processedPostsService.handlePostProcessed(event);
    }
}
