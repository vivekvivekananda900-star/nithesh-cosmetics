import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {

  apiKey: "AIzaSyC8F7U09E4HW9Oybt6fqmzyEzkKUk5nzlw",

  authDomain: "nithesh-cosmetics.firebaseapp.com",

  projectId: "nithesh-cosmetics",

  storageBucket: "nithesh-cosmetics.firebasestorage.app",

  messagingSenderId: "351681608481",

  appId: "1:351681608481:web:19cf1203328c426777dc60",

};



const app = 
  !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();



export const db =
  getFirestore(app);


export const auth =
  getAuth(app);


export const storage =
  getStorage(app);



export default app;