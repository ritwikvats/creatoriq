'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api-client';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    analytics: any;
    initialMessage?: string;
}

export default function AIChatPanel({ isOpen, onClose, analytics, initialMessage }: AIChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && initialMessage && messages.length === 0) {
            sendMessage(initialMessage);
        }
    }, [isOpen, initialMessage]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || loading) return;

        const userMessage: Message = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const data = await api.post('/ai/chat', {
                message: messageText,
                history,
                analytics,
            });

            const aiMessage: Message = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">AI Growth Consultant</h3>
                            <p className="text-white/70 text-xs">Powered by GPT-5.2</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Bot className="w-8 h-8 text-primary-600" />
                            </div>
                            <h4 className="font-bold text-dark-800 mb-1">Ask me anything</h4>
                            <p className="text-sm text-dark-500 mb-6">I have access to your analytics data and can help you grow.</p>

                            {/* Quick suggestions */}
                            <div className="space-y-2">
                                {[
                                    'Rewrite my recent captions for more engagement',
                                    'Build me a 7-day content plan',
                                    'What hashtags should I use?',
                                    'How can I get more followers?',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => sendMessage(suggestion)}
                                        className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-xl transition-colors text-dark-700"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                msg.role === 'user'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-50 border border-gray-100'
                            }`}>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm max-w-none
                                        prose-headings:text-dark-800 prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1 prose-headings:text-sm
                                        prose-p:text-dark-700 prose-p:my-1 prose-p:text-sm prose-p:leading-relaxed
                                        prose-li:text-dark-700 prose-li:text-sm prose-li:my-0
                                        prose-strong:text-dark-800
                                        prose-ul:my-1 prose-ol:my-1
                                        prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1 prose-code:rounded">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-sm">{msg.content}</p>
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 text-dark-500 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={loading}
                            className="flex-1 bg-transparent outline-none text-sm text-dark-800 placeholder:text-dark-400 disabled:opacity-50"
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || loading}
                            className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
