import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import {
    PostDto,
    PostProcessedEventDto,
} from 'src/posts/dto/post-processed-event.dto';
import { Post } from 'src/posts/entities/post.entity';
import { ProcessedPostsController } from 'src/processed-posts/processed-posts.controller';
import { App } from 'supertest/types';

const mockRepository = {
    update: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('ProcessedPostsController (e2e)', () => {
    let app: INestApplication<App>;
    let controller: ProcessedPostsController;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(getRepositoryToken(Post))
            .useValue(mockRepository)
            .compile();
        app = moduleFixture.createNestApplication();
        controller = app.get(ProcessedPostsController);
        await app.init();
    });

    it('should save the processed post', async () => {
        mockRepository.update.mockClear();
        const post = new PostDto();
        post.contentHTML = 'Hello World!';
        post.id = '00000000-0000-0000-0000-000000000001';
        const event = new PostProcessedEventDto();
        event.post = post;
        await controller.handlePostProcessed(event);
        expect(mockRepository.update).toHaveBeenCalled();
    });

    afterEach(async () => {
        await app.close();
    });
});
