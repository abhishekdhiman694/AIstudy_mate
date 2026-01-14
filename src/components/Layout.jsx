import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, Brain, MessageCircle, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Layout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: BookOpen },
        { path: '/quiz', label: 'Quiz', icon: Brain },
        { path: '/board-prep', label: 'Board Prep', icon: GraduationCap },
        { path: '/chat', label: 'AI Tutor', icon: MessageCircle },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
            <div className="max-w-7xl mx-auto min-h-[calc(100vh-4rem)] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50">

                {/* Sidebar */}
                <nav className="w-full md:w-64 bg-slate-50/50 p-6 flex flex-col border-r border-slate-100">
                    <div className="mb-8 flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                            AI
                        </div>
                        <span className="font-bold text-xl text-slate-800 tracking-tight">StudyMate</span>
                    </div>

                    <div className="space-y-2 flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={isActive ? 'primary' : 'ghost'}
                                        className={cn(
                                            "w-full justify-start gap-3 mb-1",
                                            isActive ? "shadow-md" : "hover:bg-white"
                                        )}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        <div className="bg-gradient-to-r from-violet-100 to-indigo-100 p-4 rounded-xl border border-violet-200">
                            <p className="text-xs font-semibold text-violet-700 mb-1">Pro Tip</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Ask the AI tutor to explain concepts you got wrong in quizzes!
                            </p>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-slate-50/30 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
