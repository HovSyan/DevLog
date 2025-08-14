import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    contentMarkdown: string;

    @IsOptional()
    @IsString()
    contentHTML: string | null;
}
