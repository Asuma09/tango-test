import { useState, useEffect } from 'react';

const USER_KEY = 'quiz_app_user';
const PROGRESS_KEY = 'quiz_app_progress';

export const useUserProgress = () => {
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState({});
    // wordProgress: { [chapterId]: { [englishWord]: 'correct' | 'wrong' | 'passed' } }
    const [wordProgress, setWordProgress] = useState({});

    useEffect(() => {
        // Load from local storage on mount
        const storedUser = localStorage.getItem(USER_KEY);
        const storedProgress = localStorage.getItem(PROGRESS_KEY);
        const storedWordProgress = localStorage.getItem(`${PROGRESS_KEY}_words`);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
        if (storedWordProgress) {
            setWordProgress(JSON.parse(storedWordProgress));
        }
    }, []);

    const registerUser = (name) => {
        const userData = { name, registeredAt: new Date().toISOString() };
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    const saveProgress = (chapterId, mode, scoreData, wordResults = []) => {
        // mode: '4choice' or 'input'
        // scoreData: { correct: number, total: number, percentage: number }
        // wordResults: [{ word: string, status: 'correct' | 'wrong' | 'passed' }]
        const newProgress = {
            ...progress,
            [`${chapterId}_${mode}`]: {
                ...scoreData,
                lastPlayed: new Date().toISOString()
            }
        };
        setProgress(newProgress);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));

        if (wordResults && wordResults.length > 0) {
            const currentChapterWords = wordProgress[chapterId] || {};
            const newChapterWords = { ...currentChapterWords };

            wordResults.forEach(result => {
                // If it was already correct, maybe don't downgrade it to wrong?
                // Let's just track the latest status for now, or just mark it correct permanently if it was ever correct.
                // Keeping it simple: update to latest unless it was already correct and now is wrong (optional).
                // Let's do: if it was correct, keep it correct. Otherwise update.
                if (currentChapterWords[result.word] !== 'correct') {
                    newChapterWords[result.word] = result.status;
                } else if (result.status === 'correct') {
                    newChapterWords[result.word] = 'correct'; // redundant but clear
                }
            });

            const newWordProgress = {
                ...wordProgress,
                [chapterId]: newChapterWords
            };
            setWordProgress(newWordProgress);
            localStorage.setItem(`${PROGRESS_KEY}_words`, JSON.stringify(newWordProgress));
        }
    };

    const clearData = () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(`${PROGRESS_KEY}_words`);
        setUser(null);
        setProgress({});
        setWordProgress({});
    };

    const clearWordProgress = (chapterId) => {
        const newWordProgress = { ...wordProgress };
        delete newWordProgress[chapterId];
        setWordProgress(newWordProgress);
        localStorage.setItem(`${PROGRESS_KEY}_words`, JSON.stringify(newWordProgress));
    };

    return { user, progress, wordProgress, registerUser, saveProgress, clearData, clearWordProgress };
};
