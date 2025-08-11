import { Post } from '../entities/post.entity';

export class PostCreatedEvent {
    readonly timestamp = Date.now();

    constructor(readonly post: Post) {}

    toString() {
        const { post, timestamp } = this;
        return JSON.stringify({ post, timestamp });
    }
}
