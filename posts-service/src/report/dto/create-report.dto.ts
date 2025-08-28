import { IsOptional, IsString, IsUUID } from 'class-validator';
import { AtLeastOneNotEmpty } from 'src/dto-validators';
import { CommentIdExists } from 'src/validators/comment-id-exists.validator';
import { PostIdExists } from 'src/validators/post-id-exists.validator';

export class CreateReportDto {
    @IsUUID()
    @IsOptional()
    @PostIdExists()
    postId: string;

    @IsUUID()
    @IsOptional()
    @CommentIdExists()
    commentId: string;

    @IsString()
    content: string;

    @AtLeastOneNotEmpty('postId', 'commentId')
    protected _: never;
}
