'use client';

import { useState } from 'react';
import { Search, Instagram, Youtube, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api-client';

interface CompetitorSearchProps {
    onProfileLoaded: (profile: any, platform: string) => void;
}

export default function CompetitorSearch({ onProfileLoaded }: CompetitorSearchProps) {
    const [platform, setPlatform] = useState<'instagram' | 'youtube'>('instagram');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!username.trim()) return;

        setLoading(true);
        setError('');
        try {
            const data = await api.get(`/competitors/lookup?platform=${platform}&username=${encodeURIComponent(username.trim())}`);
            if (data.success && data.profile) {
                onProfileLoaded(data.profile, platform);
            } else {
                setError(data.error || 'Failed to look up competitor');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to look up competitor. Check the username and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleAnalyze();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-dark-800">Look Up a Competitor</h2>
                <p className="text-sm text-dark-500 mt-1">Enter their username to see how you compare</p>
            </div>

            {/* Platform Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setPlatform('instagram')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        platform === 'instagram'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                            : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                    }`}
                >
                    <Instagram className="w-4 h-4" />
                    Instagram
                </button>
                <button
                    onClick={() => setPlatform('youtube')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        platform === 'youtube'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
                    }`}
                >
                    <Youtube className="w-4 h-4" />
                    YouTube
                </button>
            </div>

            {/* Username Input */}
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">@</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={platform === 'instagram' ? 'username' : 'channel handle'}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-dark-800 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || !username.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4" />
                            Analyze
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
}
