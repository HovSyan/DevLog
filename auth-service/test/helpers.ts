import * as admin from 'firebase-admin/auth';

export const createIfNotExistsATestUser = (email: string) =>
    admin
        .getAuth()
        .getUserByEmail(email)
        .catch(() => {
            return admin.getAuth().createUser({ email, emailVerified: true });
        })
        .then((user) => user.uid);
