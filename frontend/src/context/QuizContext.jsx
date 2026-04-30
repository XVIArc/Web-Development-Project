import { createContext, useContext, useReducer } from 'react';

const initialState = {
  questions: [],
  currentIndex: 0,
  answers: [],
  finished: false,
  result: null,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...initialState, questions: action.payload };
    case 'ANSWER':
      return { ...state, answers: [...state.answers, action.payload] };
    case 'NEXT':
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'FINISH':
      return { ...state, finished: true, result: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  return <QuizContext.Provider value={{ state, dispatch }}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
};
