// Source: https://github.com/zeit/next.js/issues/1999#issuecomment-326805233

//import * as firebase from 'firebase';
import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    measurementId: '<redacted>' // as was previously defined in static index.html
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();