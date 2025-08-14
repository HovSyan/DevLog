import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/v1/posts')
@UseGuards(AuthGuard)
export class PostsController {
    constructor(private readonly _postsService: PostsService) {}

    @Post()
    @HttpCode(202)
    create(@Body() createPostDto: CreatePostDto) {
        return this._postsService.create(createPostDto);
    }

    @Get()
    findAll() {
        return this._postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this._postsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this._postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this._postsService.remove(id);
    }
}
