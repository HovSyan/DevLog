import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPostsDto } from './dto/get-posts.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/get-post.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PostsService {
    private _logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        @Inject(REQUEST) private request: Request,
    ) {}

    async create(createPostDto: CreatePostDto) {
        const post = this.postsRepository.create(createPostDto);
        post.userId = this.request.user!.uid;
        this._logger.log(`Creating post for user ${post.userId}`);
        const savedPost = await this.postsRepository.save(post);
        return plainToInstance(PostResponseDto, savedPost);
    }

    async findAll(): Promise<GetPostsDto> {
        const posts = await this.postsRepository.find();
        return plainToInstance(GetPostsDto, { data: posts });
    }

    async findOne(id: string) {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            this._throwNotFound(id);
        }
        return plainToInstance(PostResponseDto, post);
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
