import { IsNotEmpty, IsString } from 'class-validator';
import { IsTopic } from '../validators/is-topic.validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsTopic()
    topicId: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
