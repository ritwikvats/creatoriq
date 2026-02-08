'use client';

import { useState, useEffect } from 'react';
import { Youtube, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { api, getAuthToken } from '@/lib/api-client';

interface ConnectYouTubeProps {
    onConnectionChange?: (connected: boolean) => void;
}

export default function ConnectYouTube({ onConnectionChange }: ConnectYouTubeProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [lastSynced, setLastSynced] = useState<string | null>(null);

    // Check connection status on mount
    useEffect(() => {
        checkConnectionStatus();
    }, []);

    const checkConnectionStatus = async () => {
        try {
            const data = await api.get('/youtube/status');

            setConnected(data.connected);
            setChannelName(data.channelName || '');
            setLastSynced(data.lastSynced || null);

            if (onConnectionChange) {
                onConnectionChange(data.connected);
            }
        } catch (error) {
            console.error('Failed to check YouTube status:', error);
            setConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setConnecting(true);
        try {
            // Get OAuth URL from backend (requires authentication)
            const data = await api.get('/youtube/auth');

            if (data.authUrl) {
                // Redirect browser to Google OAuth
                window.location.href = data.authUrl;
            } else {
                throw new Error('No auth URL returned');
            }
        } catch (error) {
            console.error('Failed to start OAuth flow:', error);
            alert('Failed to connect. Please try again.');
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect YouTube?')) {
            return;
        }

        setLoading(true);
        try {
            await api.post('/youtube/disconnect');

            setConnected(false);
            setChannelName('');
            setLastSynced(null);

            if (onConnectionChange) {
                onConnectionChange(false);
            }
        } catch (error) {
            console.error('Failed to disconnect:', error);
            alert('Failed to disconnect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await checkConnectionStatus();
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                <span className="ml-2 text-gray-600">Checking connection...</span>
            </div>
        );
    }

    if (connected) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Youtube className="w-6 h-6 text-green-700" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-green-900">YouTube Connected</p>
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-green-700">{channelName}</p>
                            {lastSynced && (
                                <p className="text-xs text-green-600 mt-1">
                                    Last synced: {new Date(lastSynced).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRefresh}
                            className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                            title="Refresh status"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDisconnect}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <Youtube className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">YouTube</p>
                        <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                </div>
                <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {connecting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                        </>
                    ) : (
                        <>
                            <Youtube className="w-4 h-4" />
                            Connect YouTube
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
