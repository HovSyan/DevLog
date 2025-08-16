import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PostIdExists } from '../validators/post-id-exists.validator';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    @PostIdExists()
    postId: string;

    @IsString()
    @IsOptional()
    parentCommentId?: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
