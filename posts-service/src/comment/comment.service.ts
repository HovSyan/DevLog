import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Comment } from './entities/comment.entity';
import { Request } from 'express';

@Injectable()
export class CommentService {
    private _logger = new Logger(CommentService.name);

    constructor(
        @InjectRepository(Comment)
        private readonly _commentRepository: Repository<Comment>,
        @Inject('REQUEST')
        private _request: Request,
    ) {}

    createComment(createCommentDto: CreateCommentDto) {
        const comment = this._commentRepository.create(createCommentDto);
        comment.userId = this._request.user!.uid;
        this._logger.log('Creating comment', comment);
        const savedComment = this._commentRepository.save(comment);
        return savedComment;
    }
}
