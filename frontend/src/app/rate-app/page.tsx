"use client";

import { useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function RateAppPage() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating >= 4) {
            if (typeof window !== 'undefined') {
                window.open(process.env.NEXT_PUBLIC_APP_STORE_URL, '_blank');
            }
        } else {
            alert('Thank you for your feedback!');
            setRating(0);
            setFeedback('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
                <h1 className="text-2xl font-bold">Enjoying the app?</h1>
                <p className="text-gray-600">Please take a moment to rate us.</p>

                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <Star
                                className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>

                {rating > 0 && (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {rating < 4 && (
                            <textarea
                                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="How can we improve?"
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                            />
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            {rating >= 4 ? 'Rate on App Store' : 'Submit Feedback'} <Send className="w-4 h-4" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
