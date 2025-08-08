import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { INJECTION_TOKENS, KAFKA_TOPICS } from 'src/constants';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreatePostResponseDto } from './dto/create-post-response.dto';
import { PostCreatedEvent } from './events/post-created.event';
import { GetPostResponseDto } from './dto/get-post-response.dto';
import { GetPostsResponseDto } from './dto/get-posts-response.dto';

@Injectable()
export class PostsService {
    private _logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        @Inject(REQUEST) private request: Request,
        @Inject(INJECTION_TOKENS.KAFKA_CLIENT)
        private _kafkaClient: ClientKafkaProxy,
    ) {}

    async create(createPostDto: CreatePostDto) {
        const post = this.postsRepository.create(createPostDto);
        post.userId = this.request.user!.uid;
        this._logger.log(`Creating post for user ${post.userId}`);
        await lastValueFrom(
            this._kafkaClient.emit(
                KAFKA_TOPICS.POST_CREATED,
                new PostCreatedEvent(post),
            ),
            { defaultValue: null },
        );
        return new CreatePostResponseDto();
    }

    async findAll(): Promise<GetPostsResponseDto> {
        const posts = await this.postsRepository.find();
        return plainToInstance(GetPostsResponseDto, { data: posts });
    }

    async findOne(id: string) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            this._throwNotFound(id);
        }
        return plainToInstance(GetPostResponseDto, post);
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        const result = await this.postsRepository.update(id, updatePostDto);
        if (result.affected === 0) {
            this._throwNotFound(id);
        }
        return this.postsRepository.findOne({ where: { id } });
    }

    async remove(id: string) {
        const result = await this.postsRepository.delete(id);
        if (result.affected === 0) {
            this._throwNotFound(id);
        }
    }

    private _throwNotFound(id: string) {
        throw new NotFoundException(`Post with id ${id} not found`);
    }
}
