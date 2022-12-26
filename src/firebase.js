import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
   apiKey: 'AIzaSyABJ8wvJdWnEUlEi7QAolfGja19qtzStQI',
   authDomain: 'netflix-clone-1643f.firebaseapp.com',
   projectId: 'netflix-clone-1643f',
   storageBucket: 'netflix-clone-1643f.appspot.com',
   messagingSenderId: '262109521969',
   appId: '1:262109521969:web:40028b33c4a8d0f1bacd10',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;
