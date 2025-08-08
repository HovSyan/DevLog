import { Post } from '../entities/post.entity';

export class PostCreatedEvent {
    constructor(readonly post: Post) {}

    toString() {
        return JSON.stringify({ post: this.post });
    }
}
