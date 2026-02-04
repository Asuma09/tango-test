import React, { useState } from 'react';

const Registration = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        onRegister(name);
    };

    return (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
            <h1 className="title-text">Welcome</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
                Enter your name to start the quiz journey.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    autoFocus
                />
                {error && <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>{error}</p>}

                <button type="submit" className="btn-primary">
                    Start Learning
                </button>
            </form>
        </div>
    );
};

export default Registration;
