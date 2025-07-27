import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as admin from 'firebase-admin/auth';
import * as client from 'firebase/auth';
import { createIfNotExistsATestUser } from './helpers';

describe('Auth', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
    });

    it('should throw an error if no Bearer token is present', () => {
        return request(app.getHttpServer())
            .post('/api/v1/auth/verify')
            .expect(400)
            .expect({
                statusCode: 400,
                message:
                    'Invalid authorization header format. Expecting a Bearer Authorization',
                error: 'Bad Request',
            });
    });

    it('should throw an error if the Bearer token is not provided', () => {
        return request(app.getHttpServer())
            .post('/api/v1/auth/verify')
            .set('Authorization', 'Bearer ')
            .expect(400)
            .expect({
                statusCode: 400,
                message: 'No token provided in the authorization header.',
                error: 'Bad Request',
            });
    });

    describe('firebase interaction', () => {
        let uid: string;
        let uidAdmin: string;

        beforeAll(async () => {
            [uid, uidAdmin] = await Promise.all([
                createIfNotExistsATestUser('test@devlog.com'),
                createIfNotExistsATestUser('test@admin.devlog.com'),
            ]);
        });

        it('should verify a valid Bearer token', async () => {
            const idToken = await admin
                .getAuth()
                .createCustomToken(uid)
                .then((customToken) =>
                    client.signInWithCustomToken(client.getAuth(), customToken),
                )
                .then(({ user }) => user.getIdToken());
            return request(app.getHttpServer())
                .post('/api/v1/auth/verify')
                .set('Authorization', `Bearer ${idToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('uid');
                    expect(res.body.uid).toBeDefined();
                });
        });

        it('should throw an UnauthorizedException for an invalid Bearer token', async () => {
            const invalidToken = await admin
                .getAuth()
                .createCustomToken(uid)
                .then((customToken) =>
                    client.signInWithCustomToken(client.getAuth(), customToken),
                )
                .then(({ user }) => user.getIdToken())
                .then((token) => token.slice(0, -1) + '_');
            return request(app.getHttpServer())
                .post('/api/v1/auth/verify')
                .set('Authorization', `Bearer ${invalidToken}`)
                .expect(401);
        });

        it('should correctly set custom user claims', async () => {
            const idToken = await admin
                .getAuth()
                .createCustomToken(uid)
                .then((customToken) =>
                    client.signInWithCustomToken(client.getAuth(), customToken),
                )
                .then(({ user }) => user.getIdToken());
            await request(app.getHttpServer())
                .post('/api/v1/auth/claims')
                .set('Authorization', `Bearer ${idToken}`)
                .expect(200)
                .expect({ success: true });
            const refreshedToken = await client
                .getAuth()
                .currentUser!.getIdToken(true);
            await request(app.getHttpServer())
                .post('/api/v1/auth/verify')
                .set('Authorization', `Bearer ${refreshedToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('role');
                    expect(res.body.role).toEqual('user');
                });
        });

        it('should correctly set custom user claims 2', async () => {
            const idToken = await admin
                .getAuth()
                .createCustomToken(uidAdmin)
                .then((customToken) =>
                    client.signInWithCustomToken(client.getAuth(), customToken),
                )
                .then(({ user }) => user.getIdToken());
            await request(app.getHttpServer())
                .post('/api/v1/auth/claims')
                .set('Authorization', `Bearer ${idToken}`)
                .expect(200)
                .expect({ success: true });
            const refreshedToken = await client
                .getAuth()
                .currentUser!.getIdToken(true);
            await request(app.getHttpServer())
                .post('/api/v1/auth/verify')
                .set('Authorization', `Bearer ${refreshedToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('role');
                    expect(res.body.role).toEqual('admin');
                });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
