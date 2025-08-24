import { IsOptional, IsUUID } from 'class-validator';
import { AtLeastOneNotEmpty } from 'src/dto-validators';

export class GetReportsQueryDto {
    @IsOptional()
    @IsUUID()
    commentId: string | null;

    @IsOptional()
    @IsUUID()
    postId: string | null;

    @AtLeastOneNotEmpty('postId', 'commentId')
    protected _: never;
}
