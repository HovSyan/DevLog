import { BadRequestException, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { BearerToken } from 'src/bearer-token.decorator';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @Post('verify')
    @HttpCode(200)
    async verify(@BearerToken() token: string) {
        const decodedToken = this._authService.verify(token);
        return decodedToken;
    }

    @Post('claims')
    @HttpCode(200)
    async setClaims(@BearerToken() token: string) {
        await this._authService.setCustomUserClaims(token);
        return { success: true };
    }
}
