import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('api/v1/comments')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly _commentService: CommentService) {}

    @Post()
    createComment(@Body() createCommentDto: CreateCommentDto) {
        return this._commentService.createComment(createCommentDto);
    }

    // @Get(':id')
    // getComment(@Param('id') id: string) {
    //     return this.commentService.getComment(id);
    // }

    // @Put(':id')
    // updateComment(
    //     @Param('id') id: string,
    //     @Body() updateCommentDto: UpdateCommentDto,
    // ) {
    //     return this.commentService.updateComment(id, updateCommentDto);
    // }

    // @Delete(':id')
    // deleteComment(@Param('id') id: string) {
    //     return this.commentService.deleteComment(id);
    // }
}
