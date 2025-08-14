import { Post } from '../entities/post.entity';

export class PostCreatedEvent {
    constructor(readonly post: Post) {}

    toString() {
        const { post } = this;
        return JSON.stringify({ post });
    }
}
