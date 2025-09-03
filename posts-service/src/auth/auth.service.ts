import { ForbiddenException, Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { DecodedUserTokenDto } from './dto/decoded-user-token.dto';
import { AuthClient } from 'devlog-common/auth-client';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUserTokenDto;
        }
    }
}

@Injectable()
export class AuthService {
    private readonly _logger = new Logger(AuthService.name);
    private readonly _authClient: AuthClient;

    constructor(private _configService: ConfigService) {
        this._authClient = new AuthClient(
            this._configService.getOrThrow('AUTH_SERVICE_URL'),
        );
    }

    async verifyToken(@Req() request: Request): Promise<void> {
        try {
            const token = request.headers['authorization']?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
            const response = await this._authClient.verifyToken(token);
            this._logger.log('Token verified successfully', response);
            const decodedToken = plainToClass(DecodedUserTokenDto, response);
            request.user = decodedToken;
        } catch (error) {
            this._logger.error('Token verification error', error);
            throw new ForbiddenException();
        }
    }
}
