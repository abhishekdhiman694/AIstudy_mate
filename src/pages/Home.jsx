import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../hooks/useStudyStore';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Book, GraduationCap, Target, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const { user, updateUser, setContext } = useStudyStore();
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');

    const handleStart = (mode) => {
        if (!subject || !topic) return;

        setContext({
            subject,
            topic,
            mode
        });

        if (mode === 'quiz') navigate('/quiz');
        if (mode === 'prep') navigate('/board-prep');
        if (mode === 'chat') navigate('/chat');
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                    Welcome, {user.name || 'Student'}! 🚀
                </motion.h1>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Your personal AI study companion. Master any subject with personalized quizzes, board exam prep, and instant doubt solving.
                </p>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-8">

                {/* Profile / Quick Setup */}
                <motion.div variants={item} className="col-span-2 md:col-span-1">
                    <Card className="h-full border-indigo-100 bg-white/80">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Study Setup</h3>
                                    <p className="text-sm text-slate-500">What do you want to learn?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Your Class</label>
                                    <Input
                                        value={user.className}
                                        onChange={(e) => updateUser({ className: e.target.value })}
                                        placeholder="e.g. 10"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Subject</label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Science"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1 block">Topic / Chapter</label>
                                    <Input
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Chemical Reactions"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Actions */}
                <motion.div variants={item} className="col-span-2 md:col-span-1 space-y-4">
                    <Card
                        hoverEffect
                        className="cursor-pointer group relative overflow-hidden border-purple-100"
                        onClick={() => handleStart('quiz')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                    <Brain size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Take a Quiz</h3>
                                    <p className="text-sm text-slate-500">Test your knowledge</p>
                                </div>
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-purple-600 transition-colors" />
                        </CardContent>
                    </Card>

                    <Card
                        hoverEffect
                        className="cursor-pointer group relative overflow-hidden border-blue-100"
                        onClick={() => handleStart('prep')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Board Prep</h3>
                                    <p className="text-sm text-slate-500">Generate exam papers</p>
                                </div>
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </CardContent>
                    </Card>

                    <Card
                        hoverEffect
                        className="cursor-pointer group relative overflow-hidden border-amber-100"
                        onClick={() => handleStart('chat')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Ask AI Tutor</h3>
                                    <p className="text-sm text-slate-500">Clear your doubts</p>
                                </div>
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-amber-600 transition-colors" />
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
