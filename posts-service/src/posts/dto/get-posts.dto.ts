import { Expose, Type } from 'class-transformer';
import { PostResponseDto } from './get-post.dto';

export class GetPostsDto {
    @Expose()
    @Type(() => PostResponseDto)
    data: PostResponseDto[];
}
