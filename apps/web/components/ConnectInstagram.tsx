'use client';

import { useState, useEffect } from 'react';
import { Instagram, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { api, getAuthToken } from '@/lib/api-client';

interface ConnectInstagramProps {
    onConnectionChange?: (connected: boolean) => void;
}

export default function ConnectInstagram({ onConnectionChange }: ConnectInstagramProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [username, setUsername] = useState('');
    const [followers, setFollowers] = useState<number | null>(null);

    useEffect(() => {
        checkConnectionStatus();
    }, []);

    const checkConnectionStatus = async () => {
        try {
            const data = await api.get('/instagram/status');
            setConnected(data.connected);
            setUsername(data.username || '');
            setFollowers(data.followers || null);

            if (onConnectionChange) {
                onConnectionChange(data.connected);
            }
        } catch (error) {
            console.error('Failed to check Instagram status:', error);
            setConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setConnecting(true);
        try {
            // Get Instagram OAuth URL (requires authentication)
            const data = await api.get('/instagram/auth');

            if (data.authUrl) {
                // Redirect to Instagram OAuth
                window.location.href = data.authUrl;
            } else {
                throw new Error('No auth URL returned');
            }
        } catch (error) {
            console.error('Failed to get auth URL:', error);
            alert('Failed to connect. Please try again.');
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect Instagram?')) {
            return;
        }

        setLoading(true);
        try {
            // Note: This endpoint doesn't exist yet, we need to add it
            await api.post('/instagram/disconnect');
            setConnected(false);
            setUsername('');
            if (onConnectionChange) onConnectionChange(false);
        } catch (error) {
            console.error('Failed to disconnect Instagram:', error);
            alert('Failed to disconnect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="ml-2 text-gray-600">Checking Instagram connection...</span>
            </div>
        );
    }

    if (connected) {
        return (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Instagram className="w-6 h-6 text-purple-700" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-purple-900">Instagram Connected</p>
                                <Check className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="text-sm text-purple-700">@{username}</p>
                            {followers !== null && (
                                <p className="text-xs text-purple-600 mt-1">
                                    {followers.toLocaleString()} followers
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <Instagram className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Instagram</p>
                        <p className="text-sm text-gray-600">Not connected</p>
                    </div>
                </div>
                <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                    {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Instagram className="w-4 h-4" />}
                    {connecting ? 'Connecting...' : 'Connect Instagram'}
                </button>
            </div>
        </div>
    );
}
