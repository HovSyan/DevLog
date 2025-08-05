import { ForbiddenException, Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { DecodedUserTokenDto } from './dto/decoded-user-token.dto';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUserTokenDto;
        }
    }
}

@Injectable()
export class AuthService {
    private readonly _url: string;
    private readonly _logger = new Logger(AuthService.name);

    constructor(private _configService: ConfigService) {
        this._url = this._configService.getOrThrow('AUTH_SERVICE_URL');
    }

    async verifyToken(@Req() request: Request): Promise<void> {
        try {
            const token = request.headers['authorization']?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
            const response = await fetch(`${this._url}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const decodedToken = plainToClass(
                DecodedUserTokenDto,
                await response.json(),
            );
            request.user = decodedToken;
        } catch (error) {
            this._logger.error('Token verification error', error);
            throw new ForbiddenException();
        }
    }
}
