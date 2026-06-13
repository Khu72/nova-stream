import { readFileSync } from 'fs';

import admin from 'firebase-admin';

const serviceAccount = JSON.parse(
    readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'project-alpha-lab-data.firebasestorage.app'
});

export default admin;