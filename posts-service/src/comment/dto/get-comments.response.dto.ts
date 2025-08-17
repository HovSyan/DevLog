import { Exclude, Expose, Type } from 'class-transformer';
import { GetCommentResponseDto } from './get-comment-response.dto';

@Exclude()
export class GetCommentsResponseDto {
    @Expose()
    @Type(() => GetCommentResponseDto)
    data: GetCommentResponseDto[];
}
