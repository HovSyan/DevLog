import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
    private _auth = getAuth();

    async verify(idToken: string) {
        return this._auth
            .verifyIdToken(idToken)
            .catch((e) => new UnauthorizedException(e));
    }
}
