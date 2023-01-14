// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, getDoc, updateDoc, doc, FieldValue, arrayUnion } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADwKiflDgXfEiSPe0Oome7ivlgxsNKTcc",
  authDomain: "mitreality.firebaseapp.com",
  databaseURL: "https://mitreality-default-rtdb.firebaseio.com",
  projectId: "mitreality",
  storageBucket: "mitreality.appspot.com",
  messagingSenderId: "895952725895",
  appId: "1:895952725895:web:b40a2574c470a1fe6d1522",
  measurementId: "G-LR2JTML4BT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let posts_list = NULL

// Get a list of cities from your database
async function getPosts(db) {
  const posts = collection(db, 'posts');
  const postsSnapshot = await getDocs(posts);
  const postsList = postsSnapshot.docs.map(doc => doc.data());
  posts_list = postsList;
}

async function newPost(db, author, text){
  const postRef = await addDoc(collection(db, "posts"), {
    author: author,
    text: text,
    likes: 0,
    comments: []
  }).then(function(postRef) {
      console.log("Document written with ID: ", postRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

async function newComment(db, postDoc, commentText){
  const posts = doc(db, `posts/${postDoc}`);
  await updateDoc(posts, {
    comments: arrayUnion(commentText)
  });
}

async function newLikes(db, postDoc){
  const posts = doc(db, `posts/${postDoc}`);
  await updateDoc(posts, {
    likes: increment(1)
  });
}

export { getPosts, newPost, newComment, newLikes }