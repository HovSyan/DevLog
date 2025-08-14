import { PostDto } from 'src/dto/post.dto';

export class PostProcessedEvent {
    constructor(public readonly post: PostDto) {}

    toString(): string {
        const { post } = this;
        return JSON.stringify({ post });
    }
}
