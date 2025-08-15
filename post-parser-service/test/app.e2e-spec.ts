import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppController } from './../src/app.controller';
import { PostProcessEventDto } from './../src/dto/post-process-event.dto';
import { PostDto } from './../src/dto/post.dto';
import { plainToInstance } from 'class-transformer';
import { INJECTIONS_TOKENS, OUTGOING_EVENTS } from '../src/constants';
import { PostProcessedEvent } from '../src/events/post-processed.event';

describe('AppController (e2e)', () => {
    let app: INestMicroservice;
    let controller: AppController;
    const mockKafkaClientProxy = {
        emit: jest.fn(),
        send: jest.fn(),
        subscribeToResponseOf: jest.fn(),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(INJECTIONS_TOKENS.KAFKA_CLIENT)
            .useValue(mockKafkaClientProxy)
            .compile();

        app = moduleFixture.createNestMicroservice<MicroserviceOptions>({
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: ['localhost:9092'],
                },
            },
        });
        controller = app.get(AppController);
        await app.init();
    });

    it('should connect', () => {
        expect(app).toBeDefined();
    });

    it('should successfully process the post created event', (done) => {
        jest.spyOn(mockKafkaClientProxy, 'emit').mockImplementation(
            (topic, message) => {
                expect(topic).toEqual(OUTGOING_EVENTS.POST_PROCESSED);
                expect(message).toBeInstanceOf(PostProcessedEvent);
                expect((message as PostProcessedEvent).post.id).toEqual('1');
                expect(
                    (message as PostProcessedEvent).post.contentHTML,
                ).toEqual('<h1 id="thisisatestpost">This is a test post</h1>');
                done();
                return Promise.resolve();
            },
        );
        const post = plainToInstance(PostDto, {
            id: '1',
            contentMarkdown: '# This is a test post',
            contentHTML: null,
        });
        const event = plainToInstance(PostProcessEventDto, { post });
        controller.handlePostUpdated(event);
    });
});
