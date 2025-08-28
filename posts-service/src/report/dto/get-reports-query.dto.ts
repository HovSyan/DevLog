import { IsOptional, IsUUID } from 'class-validator';
import { AtLeastOneNotEmpty } from 'src/dto-validators';
import { CommentIdExists } from 'src/validators/comment-id-exists.validator';
import { PostIdExists } from 'src/validators/post-id-exists.validator';

export class GetReportsQueryDto {
    @IsOptional()
    @IsUUID()
    @CommentIdExists()
    commentId: string | null;

    @IsOptional()
    @IsUUID()
    @PostIdExists()
    postId: string | null;

    @AtLeastOneNotEmpty('postId', 'commentId')
    protected _: never;
}
