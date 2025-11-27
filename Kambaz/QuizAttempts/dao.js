import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizAttemptsDao() {

    // Create a new attempt
    const createAttempt = (attempt) => {
        const newAttempt = {
            ...attempt,
            _id: uuidv4(),
            submittedAt: new Date()
        };
        return model.create(newAttempt);
    };

    // Find all attempts for a quiz by a student
    const findAttemptsByStudentAndQuiz = (studentId, quizId) => {
        return model.find({ student: studentId, quiz: quizId }).sort({ attemptNumber: -1 });
    };

    // Find the latest attempt
    const findLatestAttempt = async (studentId, quizId) => {
        const attempts = await model.find({ student: studentId, quiz: quizId })
            .sort({ attemptNumber: -1 })
            .limit(1);
        return attempts.length > 0 ? attempts[0] : null;
    };

    // Get attempt count for a student on a quiz
    const getAttemptCount = async (studentId, quizId) => {
        return await model.countDocuments({ student: studentId, quiz: quizId });
    };

    // Find attempt by ID
    const findAttemptById = (attemptId) => {
        return model.findOne({ _id: attemptId });
    };

    // Find all attempts for a quiz (for faculty)
    const findAttemptsByQuiz = (quizId) => {
        return model.find({ quiz: quizId }).sort({ submittedAt: -1 });
    };

    return {
        createAttempt,
        findAttemptsByStudentAndQuiz,
        findLatestAttempt,
        getAttemptCount,
        findAttemptById,
        findAttemptsByQuiz
    };
}