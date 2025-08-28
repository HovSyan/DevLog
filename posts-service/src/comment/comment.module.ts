import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/posts/entities/post.entity';
import { CommentsResponseDtoService } from './comments-response-dto.service';
import { ValidatorsModule } from 'src/validators/validators.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Post]),
        AuthModule,
        ValidatorsModule,
    ],
    providers: [CommentService, CommentsResponseDtoService],
    controllers: [CommentController],
})
export class CommentModule {}
