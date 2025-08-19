import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PostIdExists } from '../validators/post-id-exists.validator';
import { CommentIdExists } from '../validators/comment-id-exists.validator';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @PostIdExists()
    postId: string;

    @IsString()
    @IsOptional()
    @CommentIdExists()
    parentCommentId?: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
