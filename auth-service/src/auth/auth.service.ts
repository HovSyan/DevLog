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

    async setCustomUserClaims(idToken: string) {
        const { uid, email, email_verified } = await this.verify(idToken);
        if (email_verified && email) {
            await this._auth.setCustomUserClaims(uid, {
                role: email!.endsWith(ADMIN_EMAIL_DOMAIN) ? 'admin' : 'user',
            })
        }
    }
}
