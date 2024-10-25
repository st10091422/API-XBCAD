const admin = require('firebase-admin');
const firebase =  require('firebase')
var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'xbcad7319-express-mart.appspot.com'
});


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "xbcad7319-express-mart.firebaseapp.com",
  projectId: "xbcad7319-express-mart",
  storageBucket: "xbcad7319-express-mart.appspot.com",
  messagingSenderId: "730932209188",
  appId: "1:730932209188:web:2c0277177b6f59ee7b9ab1",
  measurementId: "G-JW4N8RYMQ1"
};

  
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const db = firebase.firestore()
const batch = db.batch()

const User = db.collection('Users')
const Product = db.collection('Products')
const Order = db.collection('Orders')
const Cart = db.collection('Carts')

 
module.exports = { auth, admin, db, batch, User, Product, Order, Cart};