import { initializeApp } from "firebase/app";
import { getMessaging, getToken as getFcmToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

let messaging: any = null;

if (typeof window !== "undefined") {
    try {
        messaging = getMessaging(app);
    } catch (e) {
        console.warn('Firebase Messaging support not available (likely HTTP context)');
    }
}

export const requestNotificationPermission = async () => {
    if (!messaging) return null;
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getFcmToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });
            console.log('FCM Token:', token);
            return token;
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
    }
    return null;
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

let analytics: any = null;
let firebaseLogEvent: ((analytics: any, eventName: string, eventParams?: { [key: string]: any; }) => void) | null = null;

if (typeof window !== "undefined") {
    import("firebase/analytics").then(({ getAnalytics, logEvent: importedLogEvent }) => {
        try {
            analytics = getAnalytics(app);
            firebaseLogEvent = importedLogEvent;
        } catch (e) {
            console.warn('Analytics failed to load', e);
        }
    });
}

export const logEvent = (eventName: string, params?: any) => {
    if (analytics && firebaseLogEvent) {
        firebaseLogEvent(analytics, eventName, params);
    } else {
        // console.log('[Mock Analytics]', eventName, params);
    }
};
