const [_1, _2, ...args] = process.argv;
if (args.length !== 1) {
    console.error("Usage: npx tsx get-jwt.ts <uid>", process.argv);
    process.exit(1);
}

import * as admin from "firebase-admin";
import * as client from 'firebase/auth';
import { initFirebaseAdmin } from "../src/firebase";
import { initFirebaseClient } from "./firebase-client";

initFirebaseAdmin();
initFirebaseClient();

(async function () {
    try {
        const uid = await admin.auth().getUserByEmail(args[0]);
        if (!uid) {
            throw new Error("User with the provided email does not exist.");
        }
        const customToken = await admin.auth().createCustomToken(uid.uid);
        const credentials = await client.signInWithCustomToken(client.getAuth(), customToken);
        const token = await credentials.user.getIdToken();
        console.log('\n', token, '\n');
    } catch (error) {
        console.error("Error creating custom token:", error);
        process.exit(1);
    }
})();
