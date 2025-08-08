import { Expose } from 'class-transformer';

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
    content: string;

    @Expose()
    imageUrl: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
