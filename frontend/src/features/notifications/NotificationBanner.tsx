"use client";

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { Bell } from 'lucide-react';

export function NotificationBanner() {
    const [permission, setPermission] = useState(Notification.permission);
    const [message, setMessage] = useState<any>(null);

    useEffect(() => {
        onMessageListener().then((payload: any) => {
            setMessage(payload);
            // Show toast or in-app notification
            alert(`New Notification: ${payload?.notification?.title}`);
        });
    }, []);

    const handleEnable = async () => {
        const token = await requestNotificationPermission();
        if (token) {
            setPermission('granted');
            // TODO: Send token to backend
        }
    };

    if (permission === 'granted') return null;

    return (
        <div className="bg-blue-600 text-white p-3 flex justify-between items-center px-4">
            <div className="flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4" />
                <span>Enable notifications to get updates on your appointments.</span>
            </div>
            <button
                onClick={handleEnable}
                className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-bold hover:bg-blue-50"
            >
                Enable
            </button>
        </div>
    );
}
