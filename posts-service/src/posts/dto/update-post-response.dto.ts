import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { GetPostResponseDto } from './get-post-response.dto';

@Exclude()
export class UpdatePostResponseDto {
    @Expose()
    @Type(() => GetPostResponseDto)
    post: GetPostResponseDto;

    @Expose()
    @Transform(({ value }) => Boolean(value) || undefined)
    submittedForProcessing = false;
}
