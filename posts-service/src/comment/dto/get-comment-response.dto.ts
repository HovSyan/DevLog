import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetCommentResponseDto {
    @Expose()
    id: string;

    @Expose()
    postId: string;

    @Expose()
    parentCommentId: string | null;

    @Expose()
    userId: string;

    @Expose()
    content: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
