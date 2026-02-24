import React, { useState } from 'react';
import { BookOpen, Edit3, Keyboard, X, List } from 'lucide-react';

const Dashboard = ({ user, quizData, progress, wordProgress, onSelectQuiz, onClearWordProgress, onBackToHome }) => {
    const [viewingChapter, setViewingChapter] = useState(null); // Chapter ID to view words for

    const handleInputQuizSelect = (chapter) => {
        // Check if there is existing history for this chapter's typing quiz
        if (wordProgress && wordProgress[chapter] && Object.keys(wordProgress[chapter]).length > 0) {
            const confirmReset = window.confirm(
                'このチャプターにはタイピングの出題履歴（正解やパスなど）があります。\n' +
                '履歴をリセットして最初から全問題を出題しますか？\n\n' +
                '[OK] リセットして開始する\n' +
                '[キャンセル] 続きから開始する'
            );
            if (confirmReset) {
                onClearWordProgress(chapter);
            }
        }
        onSelectQuiz(chapter, 'input');
    };

    if (!quizData) return <div className="glass-panel">Loading chapters...</div>;

    const chapters = Object.keys(quizData).sort((a, b) => Number(a) - Number(b));

    return (
        <div style={{ width: '100%', maxWidth: '800px' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(4px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {onBackToHome && (
                        <button
                            onClick={onBackToHome}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.4rem 0.8rem',
                                color: 'var(--color-text)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>←</span> ホーム
                        </button>
                    )}
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Hello, {user?.name || 'Guest'} 👋</h2>
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.8, display: 'none' }}>Select a chapter to begin</span>
            </header>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {chapters.map((chapter) => {
                    const questions = quizData[chapter];
                    const progressKey4 = `${chapter}_4choice`;
                    const progressKeyInput = `${chapter}_input`;

                    const score4 = progress[progressKey4];
                    const scoreInput = progress[progressKeyInput];

                    return (
                        <div key={chapter} className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Chapter {chapter}</h3>

                                <button
                                    onClick={() => setViewingChapter(chapter)}
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        color: 'white',
                                        height: 'auto'
                                    }}
                                    className="hover-bright"
                                >
                                    <List size={14} />
                                    {questions.length} Words
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                {/* 4-Choice Mode Button */}
                                <button
                                    className="btn-primary"
                                    onClick={() => onSelectQuiz(chapter, '4choice')}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        gap: '0.5rem',
                                        background: score4 ? 'rgba(74, 222, 128, 0.2)' : undefined,
                                        borderColor: score4 ? 'rgba(74, 222, 128, 0.4)' : undefined
                                    }}
                                >
                                    <BookOpen size={20} />
                                    <span style={{ fontSize: '0.9rem' }}>4-Choice</span>
                                    {score4 && (
                                        <span style={{ fontSize: '0.8rem', color: '#86efac' }}>
                                            {score4.percentage}%
                                        </span>
                                    )}
                                </button>

                                {/* Input Mode Container */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleInputQuizSelect(chapter)}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                            gap: '0.5rem',
                                            background: scoreInput ? 'rgba(74, 222, 128, 0.2)' : undefined,
                                            borderColor: scoreInput ? 'rgba(74, 222, 128, 0.4)' : undefined
                                        }}
                                    >
                                        <Keyboard size={20} />
                                        <span style={{ fontSize: '0.9rem' }}>Typing</span>
                                        {scoreInput && (
                                            <span style={{ fontSize: '0.8rem', color: '#86efac' }}>
                                                {scoreInput.percentage}%
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Word List Modal */}
            {viewingChapter && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }} onClick={() => setViewingChapter(null)}>
                    <div
                        className="glass-panel"
                        style={{
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0' // Reset padding for header/scroll area
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Chapter {viewingChapter} Word List</h3>
                            <button
                                onClick={() => setViewingChapter(null)}
                                style={{ background: 'transparent', border: 'none', padding: '0.5rem' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{
                            overflowY: 'auto',
                            padding: '1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '0.5rem'
                        }}>
                            {quizData[viewingChapter].map((word, idx) => {
                                const chapterProgress = wordProgress?.[viewingChapter] || {};
                                const status = chapterProgress[word.english];

                                // Determine colors based on status
                                let bgStyle = 'rgba(255,255,255,0.05)';
                                let textStyle = 'var(--color-text)'; // default white/light

                                if (status === 'correct') {
                                    bgStyle = 'rgba(74, 222, 128, 0.2)'; // Green tint
                                    textStyle = 'var(--color-success)';
                                } else if (status === 'wrong' || status === 'passed') {
                                    bgStyle = 'rgba(248, 113, 113, 0.2)'; // Red tint
                                    textStyle = 'var(--color-error)';
                                }

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        padding: '0.8rem',
                                        background: bgStyle,
                                        borderRadius: 'var(--radius-sm)',
                                        color: textStyle,
                                        border: '1px solid transparent',
                                        borderColor: status === 'correct' ? 'rgba(74, 222, 128, 0.4)' : (status ? 'rgba(248, 113, 113, 0.4)' : 'transparent')
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{word.english}</span>
                                        <span style={{ opacity: status ? 1 : 0.8 }}>{word.japanese}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
