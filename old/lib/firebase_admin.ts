import * as admin from 'firebase-admin'

const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS as any, 'base64').toString());

export const firebase = !admin.apps.length ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }) : admin.app();
