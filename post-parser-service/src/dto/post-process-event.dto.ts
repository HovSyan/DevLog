import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PostDto } from './post.dto';

export class PostProcessEventDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PostDto)
    post: PostDto;
}
