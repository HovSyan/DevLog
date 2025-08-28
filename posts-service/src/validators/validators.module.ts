import { Module } from '@nestjs/common';
import { PostIdExistsConstraint } from './post-id-exists.validator';
import { CommentIdExistsConstraint } from './comment-id-exists.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post])],
    providers: [CommentIdExistsConstraint, PostIdExistsConstraint],
    exports: [CommentIdExistsConstraint, PostIdExistsConstraint],
})
export class ValidatorsModule {}
