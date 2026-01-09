"use client";

import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function InvitePage() {
    const [copied, setCopied] = useState(false);
    const referralCode = "JOHN123";
    const referralLink = `https://dotech.app/invite/${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Dotech',
                    text: 'Use my code to get $10 off!',
                    url: referralLink,
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4 text-white">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Invite Friends</h1>
                    <p className="text-indigo-100">Earn $10 for every friend who books their first service!</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl space-y-6">
                    <div className="space-y-2">
                        <div className="text-sm font-medium uppercase tracking-wider text-indigo-200">Your Referral Code</div>
                        <div className="text-4xl font-mono font-bold tracking-widest">{referralCode}</div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleCopy}
                            className="flex-1 bg-white text-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied' : 'Copy Link'}
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 bg-indigo-500 border border-indigo-400 py-3 rounded-lg font-bold hover:bg-indigo-400 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                            Share
                        </button>
                    </div>
                </div>

                <div className="text-sm text-indigo-200">
                    Terms and conditions apply.
                </div>
            </div>
        </div>
    );
}
