import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';

@Controller('api/v1/comments')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly _commentService: CommentService) {}

    @Post()
    createComment(@Body() createCommentDto: CreateCommentDto) {
        return this._commentService.createComment(createCommentDto);
    }

    @Get()
    getComments(@Query() query: GetCommentsQueryDto) {
        return this._commentService.getPostComments(query);
    }

    @Get(':id')
    getComment(@Param('id') id: string) {
        return this._commentService.getComment(id);
    }

    @Put(':id')
    updateComment(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this._commentService.updateComment(id, updateCommentDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteComment(@Param('id') id: string) {
        return this._commentService.deleteComment(id);
    }
}
