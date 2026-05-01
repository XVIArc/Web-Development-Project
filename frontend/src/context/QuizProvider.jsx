import { useReducer } from "react";
import { QuizContext } from "./QuizContext";

const initialState = {
  questions: [],
  currentIndex: 0,
  answers: [],
  score: null,
  status: "idle", // idle | active | finished
};

function quizReducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...initialState, questions: action.payload, status: "active" };
    case "ANSWER":
      return {
        ...state,
        answers: [...state.answers, action.payload],
        currentIndex: state.currentIndex + 1,
        status:
          state.currentIndex + 1 >= state.questions.length
            ? "finished"
            : "active",
      };
    case "SET_SCORE":
      return { ...state, score: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}
