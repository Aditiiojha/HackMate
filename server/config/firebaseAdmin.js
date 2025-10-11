import admin from 'firebase-admin';
import dotenv from 'dotenv';

// It's good practice to call dotenv.config() in files that directly use process.env,
// though it's already called in server.js. This makes the file more self-contained.
dotenv.config();

const initializeFirebaseAdmin = () => {
  try {
    // A common issue is the format of the private key.
    // The .env file stores it as a single line with "\\n" characters.
    // We must replace them with actual newline characters for the SDK to parse it correctly.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('Firebase Admin SDK Initialized.');
  } catch (error) {
    console.error(`Firebase Admin SDK Initialization Error: ${error.message}`);
    // A failed initialization is a fatal error, so we exit.
    process.exit(1);
  }
};

export default initializeFirebaseAdmin;