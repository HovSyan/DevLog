import { Expose } from 'class-transformer';

export class CreatePostResponseDto {
    @Expose()
    message = 'The post has been submitted for processing';
}
