import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPostsDto } from './dto/get-posts.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/get-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
    ) {}

    async create(createPostDto: CreatePostDto) {
        const post = this.postsRepository.create(createPostDto);
        // TODO: Remove this line when userId is properly set
        post.userId = -1;
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
