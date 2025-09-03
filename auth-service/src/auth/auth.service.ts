import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';

const ADMIN_EMAIL_DOMAIN = '@admin.devlog.com';

@Injectable()
export class AuthService {
    private _auth = getAuth();

    async verify(idToken: string) {
        return this._auth.verifyIdToken(idToken).catch((e) => {
            throw new UnauthorizedException(e);
        });
    }
}