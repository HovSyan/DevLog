/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { getMockUUID, spyOnAuthServiceUserVerification } from './utils';
import { useContainer } from 'class-validator';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import mockPosts from './__mock__/posts';
import mockComments from './__mock__/comments';
import { DbModule } from 'src/db/db.module';

describe('CommentController (e2e)', () => {
    let app: INestApplication;
    let createdCommentId: string;
    let posts: Post[];
    let comments: Comment[];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
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

        const [postRepository, commentsRepository] = [
            moduleFixture.get<Repository<Post>>(getRepositoryToken(Post)),
            moduleFixture.get<Repository<Comment>>(getRepositoryToken(Comment)),
        ];
        await postRepository.save(mockPosts);
        await commentsRepository.save(mockComments);
        posts = await postRepository.find();
        comments = await commentsRepository.find();
        spyOnAuthServiceUserVerification(moduleFixture.get(AuthService));

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );
        useContainer(moduleFixture, { fallbackOnErrors: true });
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/v1/comments (POST)', () => {
        it('should create a comment', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({
                    postId: posts[0].id,
                    content: 'Test comment',
                })
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.content).toBe('Test comment');
            createdCommentId = res.body.id;
        });

        it('should create a reply to a comment', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({
                    postId: posts[0].id,
                    content: 'Test reply',
                    parentCommentId: createdCommentId,
                })
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.content).toBe('Test reply');
        });

        it('should fail if parentCommentId does not exist on post', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({
                    postId: posts[0].id,
                    content: 'Test reply',
                    parentCommentId: getMockUUID(),
                })
                .expect(400);
        });

        it('should fail if post id does not exist', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({
                    postId: getMockUUID(),
                    content: 'Test comment',
                })
                .expect(400);
        });

        it('should fail with invalid data', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({ content: '' })
                .expect(400);
        });

        it('should fail with invalid parentCommentId', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/comments')
                .send({
                    content: 'Test comment',
                    parentCommentId: getMockUUID(),
                })
                .expect(400);
        });
    });

    describe('/api/v1/comments (GET)', () => {
        beforeAll(async () => {
            const _commentRepository = app.get<Repository<Comment>>(
                getRepositoryToken(Comment),
            );
            await _commentRepository.deleteAll();
            await _commentRepository.save(mockComments);
        });

        it('should filter comments by postId', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/comments')
                .query({ postId: posts[0].id })
                .expect(200);

            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            res.body.data.forEach((comment: any) => {
                expect(comment.postId).toBe(posts[0].id);
            });
        });

        it('should return 400 if postId is not provided', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/comments')
                .expect(400);
        });

        it('should filter comments by post id and return formatted', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/comments')
                .query({ postId: posts[0].id, format: 'nested' })
                .expect(200);

            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(2);
        });
    });

    describe('/api/v1/comments/:id (GET)', () => {
        it('should get a comment by id', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/v1/comments/${comments[0].id}`)
                .expect(200);

            expect(res.body).toHaveProperty('id', comments[0].id);
        });

        it('should return 404 for non-existing comment', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/comments/' + getMockUUID())
                .expect(404);
        });
    });

    describe('/api/v1/comments/:id (PUT)', () => {
        it('should update a comment', async () => {
            const res = await request(app.getHttpServer())
                .put(`/api/v1/comments/${comments[0].id}`)
                .send({ content: 'Updated comment' })
                .expect(200);

            expect(res.body.content).toBe('Updated comment');
        });

        it('should return 404 for non-existing comment', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/comments/' + getMockUUID())
                .send({ content: 'Does not exist' })
                .expect(404);
        });

        it('should fail with invalid data', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/comments/' + getMockUUID())
                .send({ content: '' })
                .expect(400);
        });
    });

    describe('/api/v1/comments/:id (DELETE)', () => {
        it('should delete a comment', async () => {
            await request(app.getHttpServer())
                .delete(`/api/v1/comments/${comments[3].id}`)
                .expect(204);
        });

        it('should return fail for non uuid param', async () => {
            await request(app.getHttpServer())
                .delete('/api/v1/comments/999999')
                .expect(400);
        });

        it('should return 404 for non-existing comment', async () => {
            await request(app.getHttpServer())
                .delete('/api/v1/comments/' + getMockUUID())
                .expect(404);
        });
    });
});
