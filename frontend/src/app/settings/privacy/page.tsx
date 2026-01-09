"use client";

import { useState } from 'react';
import { Save, Lock, Bell, Eye } from 'lucide-react';

export default function PrivacySettingsPage() {
    const [settings, setSettings] = useState({
        profileVisibility: true,
        contactVisibility: false,
        marketingEmails: true,
        analyticsConsent: true,
    });

    const handleChange = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleSave = () => {
        // API call to save settings
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Privacy Settings</h1>

            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="font-medium">Public Profile Visibility</div>
                            <div className="text-sm text-gray-500">Allow others to see your profile details</div>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.profileVisibility}
                        onChange={() => handleChange('profileVisibility')}
                        className="toggle-checkbox w-6 h-6"
                    />
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="font-medium">Hide Contact Info</div>
                            <div className="text-sm text-gray-500">Only show contact info to confirmed bookings</div>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.contactVisibility}
                        onChange={() => handleChange('contactVisibility')}
                        className="toggle-checkbox w-6 h-6"
                    />
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="font-medium">Marketing Emails</div>
                            <div className="text-sm text-gray-500">Receive updates and promotional offers</div>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.marketingEmails}
                        onChange={() => handleChange('marketingEmails')}
                        className="toggle-checkbox w-6 h-6"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">Usage Analytics</div>
                        <div className="text-sm text-gray-500">Allow anonymous usage data collection to improve the app</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={settings.analyticsConsent}
                        onChange={() => handleChange('analyticsConsent')}
                        className="toggle-checkbox w-6 h-6"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
        </div>
    );
}
