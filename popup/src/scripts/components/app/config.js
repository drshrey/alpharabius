import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyD46Cqzsv2UTog0cmVyrom0jAyh9FGIiMA",
    authDomain: "alpharabius2-70521.firebaseapp.com",
    databaseURL: "https://alpharabius2-70521.firebaseio.com",
    storageBucket: "alpharabius2-70521.appspot.com",
    messagingSenderId: "530210488055"
};

firebase.initializeApp(config)

export const db = firebase.database()