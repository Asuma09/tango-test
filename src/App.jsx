import { useState, useEffect } from 'react';
import { useQuizData } from './hooks/useQuizData';
import { useUserProgress } from './hooks/useUserProgress';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Quiz4Choice from './components/Quiz4Choice';
import QuizInput from './components/QuizInput';

function App() {
  const { data: quizData, loading, error } = useQuizData();
  const { user, progress, registerUser, saveProgress } = useUserProgress();

  // Navigation State
  // view: 'loading' | 'registration' | 'dashboard' | 'quiz'
  const [view, setView] = useState('loading');
  const [activeQuiz, setActiveQuiz] = useState(null); // { chapter: '1', mode: '4choice' | 'input' }

  useEffect(() => {
    if (!loading) {
      if (user) {
        setView('dashboard');
      } else {
        setView('registration');
      }
    }
  }, [loading, user]);

  const handleRegister = (name) => {
    registerUser(name);
    setView('dashboard');
  };

  const handleSelectQuiz = (chapter, mode) => {
    setActiveQuiz({ chapter, mode });
    setView('quiz');
  };

  const handleQuizComplete = (results) => {
    // results: { correct: 10, total: 10, percentage: 100 }
    saveProgress(activeQuiz.chapter, activeQuiz.mode, results);
    // Could show a Result screen here, for now back to dashboard
    setView('dashboard');
    setActiveQuiz(null);
  };

  const handleExitQuiz = () => {
    setView('dashboard');
    setActiveQuiz(null);
  };

  if (loading) return <div className="glass-panel">Loading...</div>;
  if (error) return <div className="glass-panel" style={{ color: 'var(--color-error)' }}>Error loading data.</div>;

  return (
    <>
      {view === 'registration' && (
        <Registration onRegister={handleRegister} />
      )}

      {view === 'dashboard' && (
        <Dashboard
          user={user}
          quizData={quizData}
          progress={progress}
          onSelectQuiz={handleSelectQuiz}
        />
      )}

      {view === 'quiz' && activeQuiz && (
        <>
          {activeQuiz.mode === '4choice' ? (
            <Quiz4Choice
              chapterData={quizData[activeQuiz.chapter]}
              onComplete={handleQuizComplete}
              onExit={handleExitQuiz}
            />
          ) : (
            <QuizInput
              chapterData={quizData[activeQuiz.chapter]}
              onComplete={handleQuizComplete}
              onExit={handleExitQuiz}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
