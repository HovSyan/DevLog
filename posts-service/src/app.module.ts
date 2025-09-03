import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { ProcessedPostsModule } from './processed-posts/processed-posts.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { DbModule } from './db/db.module';

@Module({
    imports: [
        PostsModule,
        ProcessedPostsModule,
        // TODO: Make configuration validation
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        DbModule,
        ProcessedPostsModule,
        CommentModule,
        ReportModule,
    ],
})
export class AppModule {}
