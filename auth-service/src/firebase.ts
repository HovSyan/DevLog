import { cert, initializeApp } from 'firebase-admin/app';

export const initFirebaseAdmin = () =>
    initializeApp({
        credential: cert('./firebase-adminsdk.json'),
    });
