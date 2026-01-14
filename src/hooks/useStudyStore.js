import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStudyStore = create(
    persist(
        (set) => ({
            // User Profile
            user: {
                name: 'Student',
                className: '10',
                board: 'CBSE'
            },
            updateUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),

            // Study Session Context
            context: {
                subject: '',
                topic: '',
                mode: '' // 'quiz', 'prep', 'chat'
            },
            setContext: (context) => set({ context }),

            // Quiz State
            quiz: {
                currentQuiz: [],
                currentIndex: 0,
                score: 0,
                answers: {}, // { questionId: answerIndex }
                isFinished: false
            },
            setQuiz: (quizData) => set({
                quiz: {
                    currentQuiz: quizData,
                    currentIndex: 0,
                    score: 0,
                    answers: {},
                    isFinished: false
                }
            }),
            answerQuestion: (index, answer) => set((state) => {
                const isCorrect = state.quiz.currentQuiz[index].correctAnswer === answer;
                const newScore = isCorrect ? state.quiz.score + 1 : state.quiz.score;
                return {
                    quiz: {
                        ...state.quiz,
                        answers: { ...state.quiz.answers, [index]: answer },
                        score: newScore
                    }
                };
            }),
            nextQuestion: () => set((state) => ({
                quiz: { ...state.quiz, currentIndex: state.quiz.currentIndex + 1 }
            })),
            finishQuiz: () => set((state) => ({
                quiz: { ...state.quiz, isFinished: true }
            })),

            // Chat State
            chatHistory: [],
            addMessage: (msg) => set((state) => ({
                chatHistory: [...state.chatHistory, msg]
            })),
            clearChat: () => set({ chatHistory: [] }),
        }),
        {
            name: 'study-assistant-storage',
        }
    )
);
