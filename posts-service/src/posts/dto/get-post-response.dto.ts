import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetPostResponseDto {
    @Expose()
    id: string;

    @Expose()
    userId: number;

    @Expose()
    topicId: number;

    @Expose()
    title: string;

    @Expose()
    contentHTML: string;

    @Expose()
    contentMarkdown: string;

    @Expose()
    readyState: number;

    @Expose()
    imageUrl: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
