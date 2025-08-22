import { IsOptional, IsString, IsUUID } from 'class-validator';
import { AtLeastOneNotEmpty } from 'src/dto-validators';

export class CreateReportDto {
    @IsUUID()
    @IsOptional()
    postId: string;

    @IsUUID()
    @IsOptional()
    commentId: string;

    @IsString()
    content: string;

    @AtLeastOneNotEmpty('postId', 'commentId')
    private _: never;
}
