import { initializeApp } from 'firebase/app';

export const initFirebaseClient = () =>
    initializeApp({
        apiKey: 'AIzaSyCcyyEO5uaTWnB7LSY4kKfVLTSj2znbE_o',
        authDomain: 'devlog-d3ee2.firebaseapp.com',
        projectId: 'devlog-d3ee2',
        storageBucket: 'devlog-d3ee2.firebasestorage.app',
        messagingSenderId: '897604761219',
        appId: '1:897604761219:web:922bfe9ee372b288ed0db6',
        measurementId: 'G-BYKW2N54FG',
    });
