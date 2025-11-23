import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCNf8fJiPTiVhJS6Jj8YhBcE5Tm3dcio0k",
  authDomain: "rent-mimi.firebaseapp.com",
  projectId: "rent-mimi",
  storageBucket: "rent-mimi.firebasestorage.app",
  messagingSenderId: "259730181762",
  appId: "1:259730181762:web:7e7756dcfe69a08a33ae9b",
  measurementId: "G-J9QKJ396KL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Configure language for Auth emails/SMS
auth.languageCode = 'ko';