import { useState, useEffect } from 'react';
import { useQuizData } from './hooks/useQuizData';
import { useUserProgress } from './hooks/useUserProgress';
import Registration from './components/Registration';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Quiz4Choice from './components/Quiz4Choice';
import QuizInput from './components/QuizInput';

function App() {
  const { data: quizData, loading, error } = useQuizData();
  const { user, progress, wordProgress, registerUser, saveProgress, clearWordProgress } = useUserProgress();

  // Navigation State
  // view: 'loading' | 'registration' | 'home' | 'dashboard' | 'quiz'
  const [view, setView] = useState('loading');
  const [activeQuiz, setActiveQuiz] = useState(null); // { chapter: '1', mode: '4choice' | 'input' }

  useEffect(() => {
    if (!loading) {
      if (user) {
        setView('home');
      } else {
        setView('registration');
      }
    }
  }, [loading, user]);

  const handleRegister = (name) => {
    registerUser(name);
    setView('home');
  };

  const handleSelectQuiz = (chapter, mode) => {
    setActiveQuiz({ chapter, mode });
    setView('quiz');
  };

  const handleQuizComplete = (results, wordResults = []) => {
    // results: { correct: 10, total: 10, percentage: 100 }
    // wordResults: [{ word: 'dog', status: 'correct' }, ...]
    saveProgress(activeQuiz.chapter, activeQuiz.mode, results, wordResults);
    // Could show a Result screen here, for now back to dashboard
    setView('dashboard');
    setActiveQuiz(null);
  };

  const handleExitQuiz = () => {
    setView('dashboard');
    setActiveQuiz(null);
  };

  const handleSelectCourse = (courseId) => {
    if (courseId === 'pre2') {
      setView('dashboard'); // Assuming the current dashboard represents the 'pre2' course
    }
  };

  const handleBackToHome = () => {
    setView('home');
    setActiveQuiz(null);
  };

  if (loading) return <div className="glass-panel">Loading...</div>;
  if (error) return <div className="glass-panel" style={{ color: 'var(--color-error)' }}>Error loading data.</div>;

  return (
    <>
      {view === 'registration' && (
        <Registration onRegister={handleRegister} />
      )}

      {view === 'home' && (
        <Home user={user} onSelectCourse={handleSelectCourse} />
      )}

      {view === 'dashboard' && (
        <Dashboard
          user={user}
          quizData={quizData}
          progress={progress}
          wordProgress={wordProgress}
          onSelectQuiz={handleSelectQuiz}
          onClearWordProgress={clearWordProgress}
          onBackToHome={handleBackToHome}
        />
      )}

      {view === 'quiz' && activeQuiz && (
        <>
          {activeQuiz.mode === '4choice' ? (
            <Quiz4Choice
              chapterData={quizData[activeQuiz.chapter]}
              chapterId={activeQuiz.chapter} // newly added
              wordProgress={wordProgress[activeQuiz.chapter]} // newly added
              onComplete={handleQuizComplete}
              onExit={handleExitQuiz}
            />
          ) : (
            <QuizInput
              chapterData={quizData[activeQuiz.chapter]}
              chapterId={activeQuiz.chapter} // newly added
              wordProgress={wordProgress[activeQuiz.chapter]} // newly added
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
