import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import {ReactNativeAsyncStorage} from '@react-native-async-storage/async-storage'


const firebaseConfig = {
  apiKey: "AIzaSyC_sNh9nbjJGzVRGqggmcVBW6fknDtt87M",
  authDomain: "trabajo-grupal-d5ca0.firebaseapp.com",
  projectId: "trabajo-grupal-d5ca0",
  storageBucket: "trabajo-grupal-d5ca0.firebasestorage.app",
  messagingSenderId: "249130111790",
  appId: "1:249130111790:web:be78af952bcfa05259a0bf"
};



export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
