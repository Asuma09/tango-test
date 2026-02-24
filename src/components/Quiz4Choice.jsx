import React, { useState, useEffect } from 'react';
import { Shuffle, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

const Quiz4Choice = ({ chapterData, onComplete, onExit }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null); // Index of selected option
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Initialize questions on mount
    useEffect(() => {
        if (chapterData && chapterData.length > 0) {
            // Shuffle and slice to 30
            const shuffledData = [...chapterData];
            for (let i = shuffledData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
            }
            const selectedData = shuffledData.slice(0, 30);

            const generatedQuestions = selectedData.map((item) => {
                // Find 3 distractors
                const distractors = [];
                // Use the FULL chapter data for distractors, excluding the current item
                const availableWords = chapterData.filter(w => w.english !== item.english);

                while (distractors.length < 3 && availableWords.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableWords.length);
                    distractors.push(availableWords[randomIndex]);
                    availableWords.splice(randomIndex, 1); // Avoid duplicates
                }

                // Combine and shuffle
                const options = [...distractors, item];
                // Fisher-Yates shuffle
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }

                return {
                    question: item.japanese, // Question is Japanese
                    correctAnswer: item.english, // Answer is English
                    options: options.map(o => o.english)
                };
            });

            // Validate: Should already be random order due to initial shuffle, but no harm keeping logic if needed
            // Actually, selectedData is already shuffled. map preserves that order.

            setQuestions(generatedQuestions);
        }
    }, [chapterData]);

    const handleOptionClick = (option, index) => {
        if (isAnswered) return;

        const currentQuestion = questions[currentIndex];
        const correct = option === currentQuestion.correctAnswer;

        setSelectedOption(index);
        setIsAnswered(true);
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsCorrect(false);
        } else {
            setShowResult(true);
            const finalScore = isCorrect ? score + 1 : score; // Should be just 'score' because state update might be batched? 
            // Actually handleOptionClick updates score. Wait, handleOptionClick runs before this. 
            // Safe way: re-calculate or just trust state.
            // NOTE: `score` value in this render cycle is old if Next is clicked immediately? 
            // No, user clicks Option -> Render Feedback + Next Button -> User clicks Next. Score is updated.
            onComplete({
                correct: score,
                total: questions.length,
                percentage: Math.round((score / questions.length) * 100)
            });
        }
    };

    // Correction: onComplete should only be called to save progress, but we might want to show Result UI first.
    // The 'onComplete' prop might save to DB. Let's call it when rendering Result screen or simply pass the data.
    // I'll call onComplete only once when finishing.
    useEffect(() => {
        if (showResult) {
            onComplete({
                correct: score,
                total: questions.length,
                percentage: Math.round((score / questions.length) * 100)
            });
        }
    }, [showResult]);

    const handleInterrupt = () => {
        if (window.confirm('クイズを中断して現在の成績を保存しますか？')) {
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
    const progressPercent = ((currentIndex) / questions.length) * 100;

    return (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <span style={{ opacity: 0.7 }}>Question {currentIndex + 1} / {questions.length}</span>
                <button onClick={handleInterrupt} style={{ background: 'transparent', padding: '0.5rem', border: 'none', opacity: 0.8, color: 'var(--color-error)', fontWeight: 'bold', cursor: 'pointer' }}>
                    中断する
                </button>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '2rem' }}>
                <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'var(--color-success)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                }}></div>
            </div>

            {/* Question */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center' }}>
                    {currentQ.question}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                    {currentQ.options.map((option, idx) => {
                        let style = {};
                        if (isAnswered) {
                            if (option === currentQ.correctAnswer) {
                                style = { background: 'rgba(74, 222, 128, 0.4)', borderColor: 'var(--color-success)' }; // Green Correct
                            } else if (idx === selectedOption) {
                                style = { background: 'rgba(248, 113, 113, 0.4)', borderColor: 'var(--color-error)' }; // Red Wrong
                            } else {
                                style = { opacity: 0.5 };
                            }
                        }

                        return (
                            <button
                                key={idx}
                                className="btn-primary"
                                onClick={() => handleOptionClick(option, idx)}
                                disabled={isAnswered}
                                style={{
                                    minHeight: '80px',
                                    fontSize: '1.1rem',
                                    ...style
                                }}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Next Button */}
            <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isAnswered && (
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

export default Quiz4Choice;
