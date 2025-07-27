import { BadRequestException, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('verify')
    @HttpCode(200)
    verify(@Req() request: Request) {
        const token = this._getBearerTokenFromRequest(request);
        return this._authService.verify(token);
    }

    private _getBearerTokenFromRequest(request: Request): string {
        const [type, token] = request.headers.authorization?.split(' ') || [];
        if (type !== 'Bearer') {
            throw new BadRequestException(
                'Invalid authorization header format. Expecting a Bearer Authorization',
            );
        }
        if (!token) {
            throw new BadRequestException(
                'No token provided in the authorization header.',
            );
        }
        return token;
    }
}
