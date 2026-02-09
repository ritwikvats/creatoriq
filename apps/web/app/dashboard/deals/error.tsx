'use client';

export default function DealsError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Deals page error</h2>
                <p className="text-gray-600 mb-6">{error.message || 'Failed to load deals data.'}</p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
