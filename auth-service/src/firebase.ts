import { cert, initializeApp } from 'firebase-admin/app';

initializeApp({
    credential: cert('./firebase-adminsdk.json'),
});
