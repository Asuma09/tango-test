import { useState, useEffect } from 'react';

const USER_KEY = 'quiz_app_user';
const PROGRESS_KEY = 'quiz_app_progress';

export const useUserProgress = () => {
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState({});

    useEffect(() => {
        // Load from local storage on mount
        const storedUser = localStorage.getItem(USER_KEY);
        const storedProgress = localStorage.getItem(PROGRESS_KEY);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
    }, []);

    const registerUser = (name) => {
        const userData = { name, registeredAt: new Date().toISOString() };
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
    };

    const saveProgress = (chapterId, mode, scoreData) => {
        // mode: '4choice' or 'input'
        // scoreData: { correct: number, total: number, percentage: number }
        const newProgress = {
            ...progress,
            [`${chapterId}_${mode}`]: {
                ...scoreData,
                lastPlayed: new Date().toISOString()
            }
        };
        setProgress(newProgress);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    };

    const clearData = () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROGRESS_KEY);
        setUser(null);
        setProgress({});
    }

    return { user, progress, registerUser, saveProgress, clearData };
};
