import { Star } from 'lucide-react';

interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    avatarUrl?: string;
}

interface ProviderReviewsProps {
    reviews: Review[];
    rating: number;
    totalReviews: number;
}

export function ProviderReviews({ reviews, rating, totalReviews }: ProviderReviewsProps) {
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter(r => Math.round(r.rating) === star).length // Mock distribution logic
    }));

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold">Reviews ({totalReviews})</h2>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-6 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center justify-center min-w-[150px]">
                    <div className="text-5xl font-bold text-gray-900">{rating.toFixed(1)}</div>
                    <div className="flex gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">Overall Rating</p>
                </div>

                <div className="flex-1 w-full space-y-2">
                    {distribution.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-4 text-sm">
                            <span className="w-8 font-medium">{star} star</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                                />
                            </div>
                            <span className="w-8 text-gray-500 text-right">{totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <div className="font-bold">{review.author}</div>
                                    <div className="text-xs text-gray-500">{review.date}</div>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed dark:text-gray-300">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
