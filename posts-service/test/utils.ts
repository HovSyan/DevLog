/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { DecodedUserTokenDto } from 'src/auth/dto/decoded-user-token.dto';

const MOCK_USER = {
    email: 'user@mock.com',
    uid: '12345',
    roles: 'user',
};

export const spyOnAuthServiceUserVerification = (
    authService: AuthService,
    user = MOCK_USER,
) => {
    jest.spyOn(authService, 'verifyToken').mockImplementation(
        (request: Request) => {
            request.user = plainToInstance(DecodedUserTokenDto, user);
            return Promise.resolve();
        },
    );
};

export const getMockUUID = () => '123e4567-e89b-12d3-a456-426614174000';
