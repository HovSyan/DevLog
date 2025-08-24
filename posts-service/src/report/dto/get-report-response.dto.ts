import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class GetReportResponseDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    content: string;

    @Expose()
    userId: string;

    @Expose()
    @Transform(
        ({ obj }) => (obj as GetReportResponseDto).commentId ?? undefined,
    )
    commentId: string | null;

    @Expose()
    @Transform(({ obj }) => (obj as GetReportResponseDto).postId ?? undefined)
    postId: string | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
