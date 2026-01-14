import React, { useState, useEffect } from 'react';
import { useStudyStore } from '../hooks/useStudyStore';
import { aiService } from '../services/ai';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import ReactMarkdown from 'react-markdown';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BoardPrep = () => {
    const { user, context } = useStudyStore();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!context.subject) {
            navigate('/');
        }
    }, [context.subject]);

    const generatePaper = async () => {
        setLoading(true);
        try {
            const result = await aiService.generateBoardPaper({
                className: user.className,
                subject: context.subject,
                board: user.board
            });
            setPaper(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Board Exam Preparation</h2>
                    <p className="text-slate-500">Practice with AI-generated sample papers for {context.subject}</p>
                </div>
                <Button onClick={generatePaper} disabled={loading} className="gap-2">
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
                    {paper ? 'Generate New Paper' : 'Generate Sample Paper'}
                </Button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 animate-pulse">Creating a board-style question paper...</p>
                </div>
            ) : paper ? (
                <Card className="flex-1 overflow-auto bg-white border-slate-200 shadow-sm">
                    <div className="p-8 prose prose-slate max-w-none">
                        <div className="flex justify-between border-b pb-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">Sample Question Paper</h1>
                                <p className="text-sm text-slate-500">Class: {user.className} | Subject: {context.subject}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Max Marks: 80</p>
                                <p className="text-sm text-slate-500">Time: 3 Hours</p>
                            </div>
                        </div>
                        <ReactMarkdown>{paper}</ReactMarkdown>
                    </div>
                </Card>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                    <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText size={48} className="text-slate-400" />
                    </div>
                    <p className="text-lg font-medium text-slate-500">Click generate to create a practice paper</p>
                </div>
            )}
        </div>
    );
};

export default BoardPrep;
