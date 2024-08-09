import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDyBIkyVMfkfM47Y05E3yzGeouYRE9DZ8o",
  authDomain: "blog-platform-12f03.firebaseapp.com",
  databaseURL: "https://blog-platform-12f03-default-rtdb.firebaseio.com",
  projectId: "blog-platform-12f03",
  storageBucket: "blog-platform-12f03.appspot.com",
  messagingSenderId: "782849733730",
  appId: "1:782849733730:web:cd4546ccfc83ed653f0d3b"
};


const app = initializeApp(firebaseConfig);