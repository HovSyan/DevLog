import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { of } from 'rxjs';
import { INJECTION_TOKENS } from 'src/constants';
import mockPosts from './__mock__/posts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/db/db.module';
import { Post } from 'src/posts/entities/post.entity';
import {
    getMockUUID,
    saveMockData,
    spyOnAuthServiceUserVerification,
} from './utils';

describe('PostsController (e2e)', () => {
    let app: INestApplication<App>;
    let posts: Post[];

    beforeEach(async () => {
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
            .overrideProvider(INJECTION_TOKENS.KAFKA_CLIENT)
            .useValue({
                emit: jest.fn().mockReturnValue(of(null)),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        posts = (await saveMockData(app)).posts;
        await app.init();
    });

    beforeEach(() => {
        Logger.prototype.error = jest.fn();
    });

    it('should authorize for all post requests', async () => {
        await request(app.getHttpServer()).get('/api/v1/posts').expect(403);
        await request(app.getHttpServer()).get('/api/v1/posts/1').expect(403);
        await request(app.getHttpServer()).put('/api/v1/posts/1').expect(403);
        await request(app.getHttpServer())
            .delete('/api/v1/posts/1')
            .expect(403);
    });

    describe('authorized requests', () => {
        beforeEach(() => {
            spyOnAuthServiceUserVerification(app);
        });

        it('should create a post', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/posts')
                .send({
                    title: 'New Post',
                    contentMarkdown: 'Post content',
                    topicId: 1,
                })
                .expect(202);
        });

        it('should fail creating a post if topic id is not present', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/posts')
                .send({
                    title: 'New Post',
                    contentMarkdown: 'Post content',
                })
                .expect(400);
        });

        it('should retrieve all posts', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/posts')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        data: JSON.parse(JSON.stringify(mockPosts)),
                    });
                });
        });

        it('should retrieve a post by id', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/posts/' + posts[0].id)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual(
                        JSON.parse(JSON.stringify(mockPosts[0])),
                    );
                });
        });

        it('should throw 404 if post not found', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/posts/00000000-0000-0000-0000-000000000999')
                .expect(404);
        });

        it('should update a post', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/posts/' + posts[0].id)
                .send({
                    title: 'Updated Post',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        post: expect.objectContaining({
                            id: posts[0].id,
                            title: 'Updated Post',
                        }),
                    });
                });
        });

        it('should submit the post for processing if the content markdown is updated', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/posts/' + posts[0].id)
                .send({
                    title: 'Updated Post',
                    contentMarkdown: 'Updated content',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        post: expect.objectContaining({
                            id: posts[0].id,
                            title: 'Updated Post',
                            contentMarkdown: 'Updated content',
                        }),
                        submittedForProcessing: true,
                    });
                });
        });

        it('should throw 404 if there was no affected row on update', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/posts/' + getMockUUID())
                .send({
                    title: 'Updated Post',
                    contentMarkdown: 'Updated content',
                })
                .expect(404);
        });

        it('should delete a post', async () => {
            await request(app.getHttpServer())
                .delete('/api/v1/posts/' + posts[0].id)
                .expect(204);
        });

        it('should throw 404 if there is nothing to delete', async () => {
            await request(app.getHttpServer())
                .delete('/api/v1/posts/' + getMockUUID())
                .expect(404);
        });
    });

    afterEach(async () => {
        await app.close();
    });
});
