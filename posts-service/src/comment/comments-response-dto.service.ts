import { plainToInstance } from 'class-transformer';
import { CommentsFormatStrategy } from './dto/get-comments-query.dto';
import { GetCommentsResponseDto } from './dto/get-comments.response.dto';
import { Comment } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsResponseDtoService {
    convert(comments: Comment[], strategy?: CommentsFormatStrategy) {
        if (
            strategy === CommentsFormatStrategy.Flat ||
            strategy === undefined
        ) {
            return plainToInstance(GetCommentsResponseDto, { data: comments });
        }
        if (strategy === CommentsFormatStrategy.Nested) {
            return this._convertNested(comments);
        }
        throw new Error('Unknown format strategy');
    }

    private _convertNested(comments: Comment[]): GetCommentsResponseDto {
        const children = new Map<Comment['id'], Comment[]>();
        const root: Comment[] = [];

        for (const comment of comments) {
            if (comment.parentCommentId) {
                children.set(comment.parentCommentId, [
                    ...(children.get(comment.parentCommentId) || []),
                    comment,
                ]);
            } else {
                root.push(comment);
            }
        }

        return plainToInstance(GetCommentsResponseDto, {
            data: root.map((c) => ({
                ...c,
                children: children.get(c.id) || [],
            })),
        });
    }
}
