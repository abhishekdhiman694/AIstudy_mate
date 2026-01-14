import React, { useEffect, useState } from 'react';
import { useStudyStore } from '../hooks/useStudyStore';
import { aiService } from '../services/ai';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
    const { user, context, quiz, setQuiz, answerQuestion, nextQuestion, finishQuiz } = useStudyStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!context.topic) {
            navigate('/');
            return;
        }

        // Only generate if we don't have a quiz or it's a new session
        // For now, always generate new for simplicity of demo
        generateNewQuiz();
    }, [context.topic]);

    const generateNewQuiz = async () => {
        setLoading(true);
        setError(null);
        try {
            const questions = await aiService.generateQuiz({
                className: user.className,
                subject: context.subject,
                topic: context.topic,
                difficulty: 'Medium'
            });
            setQuiz(questions);
        } catch (err) {
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const currentQ = quiz.currentQuiz[quiz.currentIndex];
    const isAnswered = quiz.answers[quiz.currentIndex] !== undefined;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-lg font-medium text-slate-600 animate-pulse">Generating your personalized quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="bg-red-100 p-4 rounded-full text-red-600"><AlertCircle size={32} /></div>
                <p className="text-red-600 font-medium">{error}</p>
                <Button onClick={generateNewQuiz} variant="outline">Try Again</Button>
            </div>
        );
    }

    if (quiz.isFinished) {
        const percentage = (quiz.score / quiz.currentQuiz.length) * 100;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center space-y-8"
            >
                <Card className="border-indigo-100 bg-white/90 p-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Quiz Completed!</h2>
                    <p className="text-slate-500 mb-8">Here's how you performed</p>

                    <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="10" fill="transparent" />
                            <circle cx="80" cy="80" r="70" stroke="#4f46e5" strokeWidth="10" fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * percentage) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <span className="absolute text-3xl font-bold text-indigo-900">{Math.round(percentage)}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="text-2xl font-bold text-green-600">{quiz.score}</div>
                            <div className="text-sm text-green-700">Correct</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-2xl font-bold text-slate-600">{quiz.currentQuiz.length}</div>
                            <div className="text-sm text-slate-500">Total Questions</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button onClick={generateNewQuiz} variant="primary" size="lg">Try Another Quiz</Button>
                        <Button onClick={() => navigate('/')} variant="ghost">Back to Home</Button>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-700">
                    Question {quiz.currentIndex + 1} <span className="text-slate-400">/ {quiz.currentQuiz.length}</span>
                </h2>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    Score: {quiz.score}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={quiz.currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="mb-6 border-indigo-50 shadow-lg">
                        <CardContent className="p-6 md:p-8">
                            <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
                                {currentQ.question}
                            </p>

                            <div className="space-y-3">
                                {currentQ.options.map((option, idx) => {
                                    let stateStyle = "hover:bg-indigo-50 border-slate-200";
                                    if (isAnswered) {
                                        if (idx === currentQ.correctAnswer) stateStyle = "bg-green-100 border-green-500 text-green-900";
                                        else if (idx === quiz.answers[quiz.currentIndex]) stateStyle = "bg-red-100 border-red-500 text-red-900";
                                        else stateStyle = "opacity-50 border-slate-200";
                                    } else if (idx === quiz.answers[quiz.currentIndex]) {
                                        stateStyle = "bg-indigo-100 border-indigo-500";
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => !isAnswered && answerQuestion(quiz.currentIndex, idx)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${stateStyle}`}
                                        >
                                            <span className="font-medium">{option}</span>
                                            {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="text-green-600" size={20} />}
                                            {isAnswered && idx === quiz.answers[quiz.currentIndex] && idx !== currentQ.correctAnswer && <XCircle className="text-red-600" size={20} />}
                                        </div>
                                    );
                                })}
                            </div>

                            {isAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100"
                                >
                                    <p className="font-semibold text-blue-800 mb-1">Explanation:</p>
                                    <p className="text-blue-700 leading-relaxed">{currentQ.explanation}</p>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-end pt-4">
                {isAnswered ? (
                    quiz.currentIndex < quiz.currentQuiz.length - 1 ? (
                        <Button onClick={nextQuestion} size="lg" className="w-full md:w-auto">Next Question <ArrowRight size={18} className="ml-2" /></Button>
                    ) : (
                        <Button onClick={finishQuiz} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700">Finish Quiz</Button>
                    )
                ) : (
                    <Button disabled className="w-full md:w-auto opacity-0 pointer-events-none">Next</Button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
