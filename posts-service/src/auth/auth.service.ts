import { ForbiddenException, Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { DecodedUserTokenDto } from './dto/decoded-user-token.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

    constructor(
        private _configService: ConfigService,
        private _http: HttpService,
    ) {
        this._url = this._configService.getOrThrow('AUTH_SERVICE_URL');
    }

    async verifyToken(@Req() request: Request): Promise<void> {
        try {
            const token = request.headers['authorization']?.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
            const response = await firstValueFrom(
                this._http.post(`${this._url}/verify`, undefined, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );
            if (response.status !== 200) {
                throw new Error('Token verification failed');
            }
            this._logger.log('Token verified successfully', response.data);
            const decodedToken = plainToClass(
                DecodedUserTokenDto,
                response.data,
            );
            request.user = decodedToken;
        } catch (error) {
            this._logger.error('Token verification error', error);
            throw new ForbiddenException();
        }
    }
}
