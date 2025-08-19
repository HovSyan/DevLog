import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AuthModule } from 'src/auth/auth.module';
import { PostIdExistsConstraint } from './validators/post-id-exists.validator';
import { Post } from 'src/posts/entities/post.entity';
import { CommentsResponseDtoService } from './comments-response-dto.service';
import { CommentIdExistsConstraint } from './validators/comment-id-exists.validator';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post]), AuthModule],
    providers: [
        CommentService,
        PostIdExistsConstraint,
        CommentIdExistsConstraint,
        CommentsResponseDtoService,
    ],
    controllers: [CommentController],
})
export class CommentModule {}
