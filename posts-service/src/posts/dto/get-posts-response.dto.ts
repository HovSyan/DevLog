import { Expose, Type } from 'class-transformer';
import { GetPostResponseDto } from './get-post-response.dto';

export class GetPostsResponseDto {
    @Expose()
    @Type(() => GetPostResponseDto)
    data: GetPostResponseDto[];
}
