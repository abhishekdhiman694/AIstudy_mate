import React, { useState, useRef, useEffect } from 'react';
import { useStudyStore } from '../hooks/useStudyStore';
import { aiService } from '../services/ai';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const Chat = () => {
    const { user, context, chatHistory, addMessage } = useStudyStore();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        addMessage(userMsg);
        setInput('');
        setLoading(true);

        try {
            // Build context string
            const ctx = `User is in Class ${user.className}, studying ${context.subject}. Topic: ${context.topic || 'General'}.`;

            const response = await aiService.chatWithTutor(input, ctx);
            const aiMsg = { role: 'ai', content: response };
            addMessage(aiMsg);
        } catch (error) {
            addMessage({ role: 'ai', content: "I'm having trouble connecting right now. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-4">
            <div className="flex-1 overflow-y-auto space-y-6 pr-4" ref={scrollRef}>
                {chatHistory.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-50">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse-slow">
                            <Sparkles size={40} className="text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-700">AI Tutor is Ready</h3>
                            <p className="text-slate-500">Ask about {context.subject || 'any subject'}!</p>
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-100 text-indigo-600'
                            }`}>
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-100 shadow-sm rounded-bl-none prose prose-sm max-w-none'
                            }`}>
                            {msg.role === 'user' ? (
                                <p>{msg.content}</p>
                            ) : (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            <Card className="p-2 flex gap-2 border-indigo-100 shadow-lg">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question..."
                    className="border-0 bg-transparent focus-visible:ring-0 text-base"
                />
                <Button onClick={handleSend} disabled={loading} size="icon" className="rounded-xl">
                    <Send size={20} />
                </Button>
            </Card>
        </div>
    );
};

export default Chat;
