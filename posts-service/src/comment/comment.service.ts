import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Comment } from './entities/comment.entity';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { GetCommentResponseDto } from './dto/get-comment-response.dto';
import { CreateCommentResponseDto } from './dto/create-comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { CommentsResponseDtoService } from './comments-response-dto.service';

@Injectable()
export class CommentService {
    private _logger = new Logger(CommentService.name);

    constructor(
        @InjectRepository(Comment)
        private readonly _commentRepository: Repository<Comment>,
        @Inject('REQUEST')
        private _request: Request,
        private _commentsResponseDtoService: CommentsResponseDtoService,
    ) {}

    async createComment(createCommentDto: CreateCommentDto) {
        const comment = this._commentRepository.create(createCommentDto);
        comment.userId = this._request.user!.uid;
        this._logger.log('Creating comment', comment);
        const savedComment = await this._commentRepository.save(comment);
        return plainToInstance(CreateCommentResponseDto, savedComment);
    }

    async getComment(id: string) {
        const comment = await this._commentRepository.findOne({
            where: { id },
        });
        return plainToInstance(GetCommentResponseDto, comment);
    }

    async getPostComments(query: GetCommentsQueryDto) {
        const { postId, parentCommentId } = query;
        const comments = await this._commentRepository.find({
            where: { postId, parentCommentId },
        });
        return this._commentsResponseDtoService.convert(comments, query.format);
    }

    async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
        const result = await this._commentRepository.update(
            id,
            updateCommentDto,
        );
        if (result.affected === 0) {
            throw new NotFoundException(`Comment with id ${id} not found`);
        }
        const updatedComment = await this._commentRepository.findOne({
            where: { id },
        });
        return plainToInstance(GetCommentResponseDto, updatedComment);
    }

    async deleteComment(id: string) {
        const result = await this._commentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Comment with id ${id} not found`);
        }
    }
}
