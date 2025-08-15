import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostProcessEventDto } from './dto/post-process-event.dto';
import * as Showdown from 'showdown';
import { INJECTIONS_TOKENS, OUTGOING_EVENTS } from './constants';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { PostProcessedEvent } from './events/post-processed.event';

@Injectable()
export class AppService {
    private _logger = new Logger(AppService.name);

    constructor(
        @Inject(INJECTIONS_TOKENS.KAFKA_CLIENT)
        private readonly _kafka: ClientKafkaProxy,
    ) {}

    processPostData(event: PostProcessEventDto) {
        const post = event.post;
        const converter = new Showdown.Converter();
        const html = converter.makeHtml(post.contentMarkdown);
        if (post.contentHTML === html) return;
        post.contentHTML = html;
        this._kafka.emit(
            OUTGOING_EVENTS.POST_PROCESSED,
            new PostProcessedEvent(post),
        );
        this._logger.log(`Post with ID ${post.id} processed successfully.`);
    }
}
