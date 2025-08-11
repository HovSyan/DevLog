const [_1, _2, ...args] = process.argv;
if (args.length !== 1) {
    console.error("Usage: npx tsx get-jwt.ts <uid>", process.argv);
    process.exit(1);
}

import * as admin from "firebase-admin";
import * as client from 'firebase/auth';
import { initFirebaseAdmin } from "../src/firebase";
import { initFirebaseClient } from "./firebase-client";
import clipboard from 'clipboardy';

const logger = console;

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
        logger.log(
`\`\`\`jwt token

${token}

\`\`\``
        );
        await clipboard.write(token);
        logger.log("JWT token copied to clipboard.");
    } catch (error) {
        logger.error("Error creating custom token:", error);
        process.exit(1);
    }
})();
