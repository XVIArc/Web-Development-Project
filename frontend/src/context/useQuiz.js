import { useContext } from "react";
import { QuizContext } from "./QuizContext";

export const useQuiz = () => useContext(QuizContext);
