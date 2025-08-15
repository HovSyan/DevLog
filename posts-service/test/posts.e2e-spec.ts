import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DecodedUserTokenDto } from 'src/auth/dto/decoded-user-token.dto';
import { plainToInstance } from 'class-transformer';
import { of } from 'rxjs';
import { INJECTION_TOKENS } from 'src/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import mockPosts from './mock.posts';

describe('PostsController (e2e)', () => {
    let app: INestApplication<App>;
    const mockRepository = {
        save: jest.fn().mockResolvedValue(true),
        findOne: jest.fn().mockImplementation((query: any) => {
            return Promise.resolve(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                mockPosts.find((post) => post.id === query.where.id),
            );
        }),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
        find: jest.fn().mockResolvedValue(mockPosts),
        delete: jest.fn().mockResolvedValue(true),
        create: jest.fn().mockResolvedValue(new Post()),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(INJECTION_TOKENS.KAFKA_CLIENT)
            .useValue({
                emit: jest.fn().mockReturnValue(of(null)),
            })
            .overrideProvider(getRepositoryToken(Post))
            .useValue(mockRepository)
            .compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
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
            const authService = app.select(AuthModule).get(AuthService);
            jest.spyOn(authService, 'verifyToken').mockImplementation(
                (request) => {
                    request.user = plainToInstance(DecodedUserTokenDto, {
                        email: 'user@mock.com',
                        uid: '12345',
                        roles: 'user',
                    });
                    return Promise.resolve();
                },
            );
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
                .get('/api/v1/posts/00000000-0000-0000-0000-000000000001')
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
                .put('/api/v1/posts/00000000-0000-0000-0000-000000000001')
                .send({
                    title: 'Updated Post',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        post: JSON.parse(JSON.stringify(mockPosts[0])),
                    });
                });
        });

        it('should submit the post for processing if the content markdown is updated', async () => {
            await request(app.getHttpServer())
                .put('/api/v1/posts/00000000-0000-0000-0000-000000000001')
                .send({
                    title: 'Updated Post',
                    contentMarkdown: 'Updated content',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({
                        post: JSON.parse(JSON.stringify(mockPosts[0])),
                        submittedForProcessing: true,
                    });
                });
        });

        it('should throw 404 if there was no affected row on update', async () => {
            jest.spyOn(mockRepository, 'update').mockReturnValue(
                Promise.resolve({ affected: 0 }),
            );
            await request(app.getHttpServer())
                .put('/api/v1/posts/00000000-0000-0000-0000-000000000001')
                .send({
                    title: 'Updated Post',
                    contentMarkdown: 'Updated content',
                })
                .expect(404);
        });

        it('should delete a post', async () => {
            jest.spyOn(mockRepository, 'delete').mockReturnValue(
                Promise.resolve({ affected: 1 }),
            );
            await request(app.getHttpServer())
                .delete('/api/v1/posts/00000000-0000-0000-0000-000000000001')
                .expect(204);
        });

        it('should throw 404 if there is nothing to delete', async () => {
            jest.spyOn(mockRepository, 'delete').mockReturnValue(
                Promise.resolve({ affected: 0 }),
            );
            await request(app.getHttpServer())
                .delete('/api/v1/posts/00000000-0000-0000-0000-000000000001')
                .expect(404);
        });
    });

    afterEach(async () => {
        await app.close();
    });
});
