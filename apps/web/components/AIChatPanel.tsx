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

// Custom markdown components for beautiful rendering
const markdownComponents = {
    h1: ({ children }: any) => (
        <h1 className="text-base font-bold text-dark-900 mt-4 mb-2 pb-1 border-b border-gray-200">{children}</h1>
    ),
    h2: ({ children }: any) => (
        <div className="flex items-center gap-2 mt-5 mb-2">
            <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-purple-500 rounded-full"></div>
            <h2 className="text-sm font-bold text-dark-900">{children}</h2>
        </div>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-xs font-bold text-dark-800 mt-3 mb-1.5 uppercase tracking-wide">{children}</h3>
    ),
    p: ({ children }: any) => (
        <p className="text-xs text-dark-700 leading-relaxed my-1.5">{children}</p>
    ),
    strong: ({ children }: any) => (
        <strong className="font-semibold text-dark-900">{children}</strong>
    ),
    ul: ({ children }: any) => (
        <ul className="space-y-1 my-2">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="space-y-1.5 my-2 counter-reset-list">{children}</ol>
    ),
    li: ({ children, ordered }: any) => (
        <li className="flex items-start gap-2 text-xs text-dark-700 leading-relaxed">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-400 flex-shrink-0"></span>
            <span>{children}</span>
        </li>
    ),
    table: ({ children }: any) => (
        <div className="my-3 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">{children}</table>
        </div>
    ),
    thead: ({ children }: any) => (
        <thead className="bg-gradient-to-r from-primary-50 to-purple-50">{children}</thead>
    ),
    tbody: ({ children }: any) => (
        <tbody className="divide-y divide-gray-100">{children}</tbody>
    ),
    tr: ({ children }: any) => (
        <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
    ),
    th: ({ children }: any) => (
        <th className="px-3 py-2 text-left text-[10px] font-bold text-primary-700 uppercase tracking-wider whitespace-nowrap">{children}</th>
    ),
    td: ({ children }: any) => (
        <td className="px-3 py-2 text-xs text-dark-700 leading-relaxed">{children}</td>
    ),
    hr: () => (
        <hr className="my-3 border-gray-100" />
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-3 border-primary-300 bg-primary-50/50 pl-3 py-1.5 my-2 rounded-r-lg text-xs text-dark-600 italic">
            {children}
        </blockquote>
    ),
    code: ({ inline, children }: any) => (
        inline
            ? <code className="text-primary-700 bg-primary-50 px-1 py-0.5 rounded text-[11px] font-mono">{children}</code>
            : <pre className="bg-dark-800 text-green-300 rounded-lg p-3 my-2 overflow-x-auto text-[11px] font-mono leading-relaxed">{children}</pre>
    ),
};

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
                            <div className={`rounded-2xl px-4 py-3 ${
                                msg.role === 'user'
                                    ? 'max-w-[85%] bg-primary-600 text-white'
                                    : 'max-w-[92%] bg-white border border-gray-200 shadow-sm'
                            }`}>
                                {msg.role === 'assistant' ? (
                                    <div className="ai-chat-content">
                                        <ReactMarkdown components={markdownComponents}>
                                            {msg.content}
                                        </ReactMarkdown>
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
                            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 text-dark-500 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                                    <span className="text-xs">Analyzing your data...</span>
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
