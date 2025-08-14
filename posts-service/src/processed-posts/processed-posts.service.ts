import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { POST_READY_STATES } from 'src/constants';
import { PostProcessedEventDto } from 'src/posts/dto/post-processed-event.dto';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class ParsedPostsService {
    private _logger = new Logger(ParsedPostsService.name);

    constructor(
        @InjectRepository(Post)
        private readonly _postsRepository: Repository<Post>,
    ) {}

    async handlePostProcessed(event: PostProcessedEventDto) {
        const { post } = event;
        const updatedResult = await this._postsRepository.update(post.id, {
            contentHTML: post.contentHTML,
            readyState: POST_READY_STATES.READY,
        });
        if (updatedResult.affected === 0) {
            this._logger.warn(`Post with ID ${post.id} not found for update.`);
        } else {
            this._logger.log(`Post with ID ${post.id} updated successfully.`);
        }
    }
}
