import { Expose, Transform } from 'class-transformer';
import { GetPostResponseDto } from './get-post-response.dto';

export class UpdatePostResponseDto {
    @Expose()
    post: GetPostResponseDto;

    @Expose()
    @Transform(({ value }) => Boolean(value) || undefined)
    submittedForProcessing = false;
}
