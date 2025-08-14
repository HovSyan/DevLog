import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PostDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    contentHTML: string;
}

export class PostProcessedEventDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PostDto)
    post: PostDto;
}
