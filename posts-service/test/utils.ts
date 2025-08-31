/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { DecodedUserTokenDto } from 'src/auth/dto/decoded-user-token.dto';
import mockUser from './__mock__/user';
import mockPosts from './__mock__/posts';
import mockComments from './__mock__/comments';
import mockReports from './__mock__/reports';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Report } from 'src/report/entities/report.entity';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const spyOnAuthServiceUserVerification = (app: INestApplication) => {
    jest.spyOn(app.get(AuthService), 'verifyToken').mockImplementation(
        (request: Request) => {
            request.user = plainToInstance(DecodedUserTokenDto, mockUser);
            return Promise.resolve();
        },
    );
};

export const saveMockData = async (app: INestApplication) => {
    const repositories = {
        posts: app.get<Repository<Post>>(getRepositoryToken(Post)),
        comments: app.get<Repository<Comment>>(getRepositoryToken(Comment)),
        reports: app.get<Repository<Report>>(getRepositoryToken(Report)),
    };
    const data = {
        posts: await repositories.posts.save(mockPosts),
        comments: await repositories.comments.save(mockComments),
        reports: await repositories.reports.save(mockReports),
    };
    return data;
};

export const getMockUUID = () => '123e4567-e89b-12d3-a456-426614174000';

export const getMockPost = () => {
    return {
        id: randomUUID(),
        title: 'Mock Post',
        contentMarkdown: 'This is a mock post',
        topicId: 1,
        userId: mockUser.uid,
        readyState: 1,
        imageUrl: 'https://example.com/mock-image.jpg',
        contentHTML: '<p>This is a mock post</p>',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
