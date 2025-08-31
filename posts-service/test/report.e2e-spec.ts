/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NestApplication } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthService } from 'src/auth/auth.service';
import {
    getMockPost,
    getMockUUID,
    saveMockData,
    spyOnAuthServiceUserVerification,
} from './utils';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Report } from 'src/report/entities/report.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { useContainer } from 'class-validator';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Report controller (e2e)', () => {
    let app: NestApplication;
    let reports: Report[];
    let comments: Comment[];
    let posts: Post[];

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideModule(DbModule)
            .useModule(
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    synchronize: true,
                    autoLoadEntities: true,
                }),
            )
            .compile();

        app = moduleFixture.createNestApplication();

        const data = await saveMockData(app);
        reports = data.reports;
        comments = data.comments;
        posts = data.posts;

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        useContainer(moduleFixture, { fallbackOnErrors: true });
        await app.init();
    });

    beforeEach(() => {
        Logger.prototype.error = jest.fn();
    });

    it('should create', () => {
        expect(app).toBeDefined();
    });

    it('should fail for unauthorized requests', async () => {
        const authService = app.get(AuthService);
        jest.spyOn(authService, 'verifyToken');
        await request(app.getHttpServer()).get('/api/v1/reports').expect(403);
        await request(app.getHttpServer()).get('/api/v1/reports').expect(403);
        await request(app.getHttpServer())
            .put('/api/v1/reports/' + getMockUUID())
            .expect(403);
        await request(app.getHttpServer())
            .get('/api/v1/reports/' + getMockUUID())
            .expect(403);
        await request(app.getHttpServer())
            .delete('/api/v1/reports/' + getMockUUID())
            .expect(403);
    });

    describe('authorized requests', () => {
        beforeEach(() => {
            spyOnAuthServiceUserVerification(app);
        });

        describe('Report creation', () => {
            it('should create a report for a post', async () => {
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        postId: posts[0].id,
                        content: 'This is a test report',
                    })
                    .expect(201);

                expect(response.body).toHaveProperty('id');
                expect(response.body.content).toBe('This is a test report');
                expect(response.body.postId).toBe(posts[0].id);
            });

            it('should create a report for a comment', async () => {
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        commentId: comments[0].id,
                        content: 'This is a test report for a comment',
                    })
                    .expect(201);

                expect(response.body).toHaveProperty('id');
                expect(response.body.content).toBe(
                    'This is a test report for a comment',
                );
                expect(response.body.commentId).toBe(comments[0].id);
            });

            it('should fail to create a report with both postId and commentId', async () => {
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        postId: posts[0].id,
                        commentId: comments[0].id,
                        content:
                            'This is a test report with both postId and commentId',
                    })
                    .expect(400);

                expect(response.body).toHaveProperty('message');
                expect(response.body.message[0]).toBe(
                    'At most one of [postId, commentId] must be provided.',
                );
            });

            it('should fail to create a report with neither postId nor commentId', async () => {
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        content:
                            'This is a test report with neither postId nor commentId',
                    })
                    .expect(400);

                expect(response.body).toHaveProperty('message');
                expect(response.body.message[0]).toBe(
                    'At least one of [postId, commentId] must be provided.',
                );
            });

            it('should fail to create a report for a non-existing post', async () => {
                const postId = getMockUUID();
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        postId,
                        content:
                            'This is a test report for a non-existing post',
                    })
                    .expect(400);

                expect(response.body).toHaveProperty('message');
                expect(response.body.message[0]).toBe(
                    `Post with ID ${postId} does not exist`,
                );
            });

            it('should fail to create a report for a non-existing comment', async () => {
                const commentId = getMockUUID();
                const response = await request(app.getHttpServer())
                    .post('/api/v1/reports')
                    .send({
                        commentId,
                        content:
                            'This is a test report for a non-existing comment',
                    })
                    .expect(400);

                expect(response.body).toHaveProperty('message');
                expect(response.body.message[0]).toBe(
                    `Comment with ID ${commentId} does not exist`,
                );
            });
        });

        describe('Report get', () => {
            it('should get a report by ID', async () => {
                const response = await request(app.getHttpServer())
                    .get(`/api/v1/reports/${reports[0].id}`)
                    .expect(200);

                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(reports[0].id);
            });

            it('should return 404 for non-existing report', async () => {
                await request(app.getHttpServer())
                    .get(`/api/v1/reports/${getMockUUID()}`)
                    .expect(404);
            });

            it('should return 400 for invalid UUID', async () => {
                await request(app.getHttpServer())
                    .get(`/api/v1/reports/invalid-uuid`)
                    .expect(400);
            });
        });

        describe('Update report', () => {
            it('should update a report', async () => {
                const response = await request(app.getHttpServer())
                    .put(`/api/v1/reports/${reports[0].id}`)
                    .send({
                        content: 'This is an updated test report',
                    })
                    .expect(200);

                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(reports[0].id);
                expect(response.body.content).toBe(
                    'This is an updated test report',
                );
            });

            it('should return 404 for non-existing report', async () => {
                await request(app.getHttpServer())
                    .put(`/api/v1/reports/${getMockUUID()}`)
                    .send({
                        content: 'This is an updated test report',
                    })
                    .expect(404);
            });

            it('should return 400 for invalid UUID', async () => {
                await request(app.getHttpServer())
                    .put(`/api/v1/reports/invalid-uuid`)
                    .send({
                        content: 'This is an updated test report',
                    })
                    .expect(400);
            });
        });

        describe('Delete report', () => {
            it('should delete a report', async () => {
                const response = await request(app.getHttpServer())
                    .post(`/api/v1/reports`)
                    .send({
                        postId: posts[0].id,
                        commentId: null,
                        content: 'This is a report',
                    })
                    .expect(201);

                await request(app.getHttpServer())
                    .delete(`/api/v1/reports/${response.body.id}`)
                    .expect(204);
                await request(app.getHttpServer())
                    .get(`/api/v1/reports/${response.body.id}`)
                    .expect(404);
            });

            it('should return 404 for non-existing report', async () => {
                await request(app.getHttpServer())
                    .delete(`/api/v1/reports/${getMockUUID()}`)
                    .expect(404);
            });

            it('should return 400 for invalid UUID', async () => {
                await request(app.getHttpServer())
                    .delete(`/api/v1/reports/invalid-uuid`)
                    .expect(400);
            });
        });

        describe('Get reports', () => {
            it('should return all post reports', async () => {
                const response = await request(app.getHttpServer())
                    .get(`/api/v1/reports`)
                    .query({
                        postId: posts[0].id,
                    })
                    .expect(200);

                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toBeInstanceOf(Array);
                expect(response.body.data.length).toBeGreaterThan(0);
                expect(
                    (response.body.data as Report[]).map((r) => r.id),
                ).toEqual(
                    expect.arrayContaining(
                        reports
                            .filter((r) => r.postId === posts[0].id)
                            .map((r) => r.id),
                    ),
                );
            });

            it('should return all comment reports', async () => {
                const response = await request(app.getHttpServer())
                    .get(`/api/v1/reports`)
                    .query({
                        commentId: comments[0].id,
                    })
                    .expect(200);

                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toBeInstanceOf(Array);
                expect(response.body.data.length).toBeGreaterThan(0);
                expect(
                    (response.body.data as Report[]).map((r) => r.id),
                ).toEqual(
                    expect.arrayContaining(
                        reports
                            .filter((r) => r.commentId === comments[0].id)
                            .map((r) => r.id),
                    ),
                );
            });
        });

        it('should throw if there is no postId or commentId', async () => {
            await request(app.getHttpServer())
                .get(`/api/v1/reports`)
                .query({
                    postId: getMockUUID(),
                })
                .expect(400);
            await request(app.getHttpServer())
                .get(`/api/v1/reports`)
                .query({
                    commentId: getMockUUID(),
                })
                .expect(400);
        });

        it('should not throw if there are no reports', async () => {
            const mockPost = getMockPost();
            await app
                .get<Repository<Post>>(getRepositoryToken(Post))
                .save(mockPost);
            const response = await request(app.getHttpServer())
                .get(`/api/v1/reports`)
                .query({
                    postId: mockPost.id,
                })
                .expect(200);
            expect(response.body.data).toEqual([]);
            await app
                .get<Repository<Post>>(getRepositoryToken(Post))
                .delete({ id: mockPost.id });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
