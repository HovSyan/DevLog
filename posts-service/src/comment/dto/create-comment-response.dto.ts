import { Exclude } from 'class-transformer';
import { GetCommentResponseDto } from './get-comment-response.dto';

@Exclude()
export class CreateCommentResponseDto extends GetCommentResponseDto {}
