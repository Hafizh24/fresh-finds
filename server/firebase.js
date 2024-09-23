require('dotenv').config()

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'fresh-finds-9be30.firebaseapp.com',
  projectId: 'fresh-finds-9be30',
  storageBucket: 'fresh-finds-9be30.appspot.com',
  messagingSenderId: '666959948421',
  appId: '1:666959948421:web:a52d5ec00292d1de4397ec'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export const registerWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.log('Error from firebase auth:', error)
  }
}
