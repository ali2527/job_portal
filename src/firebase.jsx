import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDUNUn48Qh9PTBM7ZPv5ofyEv9FRyNCv2g',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'job-listing-app-7911f',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
