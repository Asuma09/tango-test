import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Home, Clock } from 'lucide-react';

const QuizInput = ({ chapterData, wordProgress, onComplete, onExit }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Track results for each word in this session
    // Array of { word: string, status: 'correct' | 'wrong' | 'passed' }
    const [wordResults, setWordResults] = useState([]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(30);
    const timerRef = useRef(null);

    // Initialize questions
    useEffect(() => {
        if (chapterData && chapterData.length > 0) {
            // Filter out words that are already 'correct'
            const chapterProgress = wordProgress || {};
            const availableData = chapterData.filter(item => chapterProgress[item.english] !== 'correct');

            // If all words are already correct, maybe we should just use all of them again for review.
            // Let's implement that: if availableData is empty, fallback to full chapterData.
            let dataToUse = availableData.length > 0 ? availableData : chapterData;

            // Shuffle
            const shuffledData = [...dataToUse];
            for (let i = shuffledData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
            }
            // Slice to max 30
            const selectedData = shuffledData.slice(0, 30);

            // Deep copy to avoid mutating original data if we act on it
            const qs = selectedData.map(item => ({
                question: item.japanese,
                correctAnswer: item.english
            }));

            // qs is already shuffled from the initial shuffle above.

            setQuestions(qs);
        }
    }, [chapterData]);

    // Timer Logic
    useEffect(() => {
        if (showResult || questions.length === 0) return;

        // Reset timer when question changes
        setTimeLeft(30);

        if (timerRef.current) clearInterval(timerRef.current);

        if (!isAnswered) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [currentIndex, isAnswered, questions.length, showResult]);

    const handleTimeUp = () => {
        clearInterval(timerRef.current);
        const currentQ = questions[currentIndex];
        setIsAnswered(true);
        setIsCorrect(false); // Time up = failure
        setWordResults(prev => [...prev, { word: currentQ.correctAnswer, status: 'wrong' }]);
    };

    const handlePass = () => {
        if (isAnswered) return;

        clearInterval(timerRef.current);
        const currentQ = questions[currentIndex];

        // Populate the input with correct answer visually and mark as answered/incorrect
        setInputValue(currentQ.correctAnswer);
        setIsAnswered(true);
        setIsCorrect(false);
        setWordResults(prev => [...prev, { word: currentQ.correctAnswer, status: 'passed' }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAnswered) return;

        if (!inputValue.trim()) return; // Don't submit empty

        clearInterval(timerRef.current);

        const currentQ = questions[currentIndex];
        // Normalize: Trim and Lowercase
        const correct = inputValue.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();

        setIsAnswered(true);
        setIsCorrect(correct);

        setWordResults(prev => [
            ...prev,
            { word: currentQ.correctAnswer, status: correct ? 'correct' : 'wrong' }
        ]);

        if (correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setInputValue('');
            setIsAnswered(false);
            setIsCorrect(false);
        } else {
            setShowResult(true);
            // Wait for effect to call onComplete
        }
    };

    useEffect(() => {
        if (showResult) {
            onComplete({
                correct: score,
                total: questions.length,
                percentage: Math.round((score / questions.length) * 100)
            }, wordResults); // pass wordResults to App.jsx -> useUserProgress
        }
    }, [showResult]);

    const handleInterrupt = () => {
        if (window.confirm('クイズを中断して現在の成績を保存しますか？')) {
            clearInterval(timerRef.current);
            const answeredTotal = isAnswered ? currentIndex + 1 : currentIndex;
            if (answeredTotal === 0) {
                onExit();
                return;
            }
            setQuestions(prev => prev.slice(0, answeredTotal));
            setShowResult(true);
        }
    };

    if (questions.length === 0) return <div className="glass-panel">Preparing Quiz...</div>;

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 className="title-text">Quiz Complete!</h2>
                <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '2rem 0', color: percentage >= 80 ? 'var(--color-success)' : 'white' }}>
                    {percentage}%
                </div>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    You got {score} out of {questions.length} correct.
                </p>
                <button className="btn-primary" onClick={onExit} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={20} /> Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    // Calculate timer color
    const timerColor = timeLeft <= 5 ? 'var(--color-error)' : 'white';

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{ opacity: 0.7 }}>Question {currentIndex + 1} / {questions.length}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timerColor, fontWeight: 'bold' }}>
                        <Clock size={18} /> {timeLeft}s
                    </div>
                    <button onClick={handleInterrupt} style={{ background: 'transparent', padding: '0.5rem', border: 'none', opacity: 0.8, color: 'var(--color-error)', fontWeight: 'bold', cursor: 'pointer' }}>
                        中断する
                    </button>
                </div>
            </div>

            {/* Timer Bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '2rem' }}>
                <div style={{
                    width: `${(timeLeft / 30) * 100}%`,
                    height: '100%',
                    background: timeLeft <= 5 ? 'var(--color-error)' : 'var(--color-success)',
                    borderRadius: '2px',
                    transition: 'width 1s linear'
                }}></div>
            </div>

            {/* Question */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center' }}>
                    {currentQ.question}
                </h2>

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your answer in English"
                        disabled={isAnswered}
                        autoFocus
                        style={{
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            borderColor: isAnswered
                                ? (isCorrect ? 'var(--color-success)' : 'var(--color-error)')
                                : undefined,
                            background: isAnswered
                                ? (isCorrect ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)')
                                : undefined
                        }}
                    />
                </form>

                {isAnswered && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        {isCorrect ? (
                            <p style={{ color: 'var(--color-success)', fontSize: '1.2rem', fontWeight: 'bold' }}>Correct!</p>
                        ) : (
                            <div>
                                <p style={{ color: 'var(--color-error)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {inputValue.toLowerCase() === currentQ.correctAnswer.toLowerCase() ? 'Passed' : 'Incorrect'}
                                </p>
                                {/* Only show correct answer if it's not a pass (since pass fills in the input) */}
                                {inputValue.toLowerCase() !== currentQ.correctAnswer.toLowerCase() && (
                                    <p style={{ marginTop: '0.5rem' }}>Correct Answer: <strong>{currentQ.correctAnswer}</strong></p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                {!isAnswered ? (
                    <>
                        <button
                            type="button" // important to avoid form submission if placed inside or clicked
                            onClick={handlePass}
                            className="btn-primary"
                            style={{ background: 'transparent', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                        >
                            パス
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn-primary"
                            disabled={!inputValue.trim()}
                            style={{ opacity: !inputValue.trim() ? 0.5 : 1 }}
                        >
                            Submit
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn-primary"
                        style={{
                            background: 'white',
                            color: 'var(--color-primary-bg)',
                            fontWeight: 'bold',
                            padding: '0.8rem 2rem',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        Next <ArrowRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizInput;
