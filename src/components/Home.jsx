import React from 'react';
import { Book, Award, Clock } from 'lucide-react';

const Home = ({ user, onSelectCourse }) => {
    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                        Welcome back, {user?.name}!
                    </h1>
                    <p style={{ margin: 0, opacity: 0.8 }}>学習するコースを選択してください</p>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* 準2級コースカード */}
                <button
                    onClick={() => onSelectCourse('pre2')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'var(--color-text)',
                        textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <Book size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 'bold' }}>英単語：準2級</h2>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                        基礎から実践まで、準2級レベルの必須単語をマスターしましょう。
                    </p>
                </button>

                {/* 将来のためのダミーカード（Coming Soon） */}
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        color: 'var(--color-text)',
                        opacity: 0.5,
                        textAlign: 'center'
                    }}
                >
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <Award size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 'bold' }}>準備中</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Coming Soon</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
