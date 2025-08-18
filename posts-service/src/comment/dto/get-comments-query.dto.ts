import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PostIdExists } from '../validators/post-id-exists.validator';

export const enum CommentsFormatStrategy {
    Flat = 'flat',
    Nested = 'nested',
}

export class GetCommentsQueryDto {
    @IsNotEmpty()
    @IsUUID()
    @PostIdExists()
    postId: string;

    @IsUUID()
    @IsOptional()
    parentCommentId?: string;

    @IsOptional()
    @IsEnum([CommentsFormatStrategy.Flat, CommentsFormatStrategy.Nested])
    format?: CommentsFormatStrategy;
}
