import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { DecodedIdToken } from 'firebase-admin/auth';

class MockAuthService implements Partial<AuthService> {
    verify(idToken: string) {
        return idToken === 'valid_token'
            ? Promise.resolve({ uid: '12345' } as DecodedIdToken)
            : Promise.reject(new UnauthorizedException('Invalid token'));
    }
}

describe('Auth', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useClass(MockAuthService)
            .compile();
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

    it('should verify a valid Bearer token', async () => {
        const mockToken = 'valid_token';
        return request(app.getHttpServer())
            .post('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${mockToken}`)
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('uid');
                expect(res.body.uid).toBeDefined();
            });
    });

    it('should throw an UnauthorizedException for an invalid Bearer token', () => {
        const mock = 'invalid_token';
        return request(app.getHttpServer())
            .post('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${mock}`)
            .expect(401)
            .expect({
                statusCode: 401,
                message: 'Invalid token',
                error: 'Unauthorized',
            });
    });

    afterAll(async () => {
        await app.close();
    })
});
