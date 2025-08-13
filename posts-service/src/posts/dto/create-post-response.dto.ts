import { Exclude } from 'class-transformer';
import { GetPostResponseDto } from './get-post-response.dto';

@Exclude()
export class CreatePostResponseDto extends GetPostResponseDto {}
