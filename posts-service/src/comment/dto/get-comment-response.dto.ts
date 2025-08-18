import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class GetCommentResponseDto {
    @Expose()
    id: string;

    @Expose()
    postId: string;

    @Expose()
    @Transform(
        ({ obj }) =>
            (obj as GetCommentResponseDto).parentCommentId ?? undefined,
    )
    parentCommentId: string | null;

    @Expose()
    userId: string;

    @Expose()
    content: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => GetCommentResponseDto)
    children?: GetCommentResponseDto[];
}
