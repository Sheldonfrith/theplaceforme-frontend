var firebase =require( 'firebase-admin');

/** @type {any} */
var serviceAccount = require("../theplaceforme-firebase-key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://theplaceforme-bc9bb.firebaseio.com"
});

module.exports =  firebase;