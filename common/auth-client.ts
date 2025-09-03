import Axios, { AxiosInstance } from 'axios';

export type VerifyTokenResponse = {
    uid: string;
    email: string;
};

export class AuthClient {
    private _axios: AxiosInstance;

    constructor(baseURL: string) {
        this._axios = Axios.create({ baseURL });
    }

    async verifyToken(token: string) {
        const response = await this._axios.post<VerifyTokenResponse>('/verify', undefined, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) {
            throw new Error('Token verification failed');
        }
        return response.data;
    }
}
