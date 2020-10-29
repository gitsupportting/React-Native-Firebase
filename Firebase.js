import firebase from 'firebase';
import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAxWh2s8NfPTtOOppNKUATAPpS3fSDO_k0",
    authDomain: "kablanim-6cdbc.firebaseapp.com",
    databaseURL: "https://kablanim-6cdbc.firebaseio.com",
    projectId: "kablanim-6cdbc",
    storageBucket: "kablanim-6cdbc.appspot.com",
    messagingSenderId: "933938986840",
    appId: "1:933938986840:web:d5543820062be81893af2d",
    measurementId: "G-YPL39JR0B9"
};

const Firebase = firebase.initializeApp(firebaseConfig);
// const auth = firebaseApp.auth();
const db = Firebase.firestore();
export { db, Firebase };
// export default Firebase;