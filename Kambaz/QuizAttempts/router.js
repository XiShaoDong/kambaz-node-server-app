import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptsRoutes(app) {
    const dao = QuizAttemptsDao();
    const quizzesDao = QuizzesDao();

    // Get all attempts for a student on a specific quiz
    const getStudentAttempts = async (req, res) => {
        try {
            const { studentId, quizId } = req.params;
            const attempts = await dao.findAttemptsByStudentAndQuiz(studentId, quizId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get latest attempt for a student on a quiz
    const getLatestAttempt = async (req, res) => {
        try {
            const { studentId, quizId } = req.params;
            const attempt = await dao.findLatestAttempt(studentId, quizId);
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Submit a quiz attempt
    const submitAttempt = async (req, res) => {
        try {
            const { quizId } = req.params;
            const { studentId, answers, timeSpent } = req.body;

            // Get the quiz
            const quiz = await quizzesDao.findQuizById(quizId);
            if (!quiz) {
                return res.status(404).json({ error: "Quiz not found" });
            }

            // Get attempt count
            const attemptCount = await dao.getAttemptCount(studentId, quizId);
            const attemptNumber = attemptCount + 1;

            // Grade the answers
            let totalScore = 0;
            const gradedAnswers = answers.map((answer) => {
                const question = quiz.questions.find(q => q._id === answer.question);
                if (!question) {
                    return { ...answer, isCorrect: false, pointsEarned: 0 };
                }

                let isCorrect = false;
                let pointsEarned = 0;

                // Check answer based on question type
                if (question.type === "multipleChoice") {
                    const correctChoice = question.choices.find(c => c.isCorrect);
                    isCorrect = answer.answer === correctChoice?._id;
                    pointsEarned = isCorrect ? question.points : 0;
                } else if (question.type === "trueFalse") {
                    isCorrect = answer.answer === question.correctAnswer;
                    pointsEarned = isCorrect ? question.points : 0;
                } else if (question.type === "fillInBlank") {
                    if (question.blanks && question.blanks.length > 0) {
                        // Check if all blanks are correct
                        isCorrect = question.blanks.every(blank => {
                            const userAnswer = answer.answer?.[blank.id] || "";
                            const normalizedUserAnswer = blank.caseSensitive 
                                ? userAnswer 
                                : userAnswer.toLowerCase();
                            
                            const possibleAnswers = blank.caseSensitive
                                ? blank.possibleAnswers
                                : blank.possibleAnswers.map(a => a.toLowerCase());
                            
                            return possibleAnswers.includes(normalizedUserAnswer);
                        });
                        pointsEarned = isCorrect ? question.points : 0;
                    } 
                    else {
                        const studentAnswer = question.caseSensitive 
                            ? answer.answer 
                            : answer.answer?.toLowerCase();
                        const possibleAnswers = question.caseSensitive
                            ? question.possibleAnswers
                            : question.possibleAnswers.map(a => a.toLowerCase());
                        isCorrect = possibleAnswers.includes(studentAnswer);
                        pointsEarned = isCorrect ? question.points : 0;
                    }
                }

                totalScore += pointsEarned;

                return {
                    question: answer.question,
                    answer: answer.answer,
                    isCorrect,
                    pointsEarned
                };
            });

            // Create attempt
            const attempt = {
                quiz: quizId,
                student: studentId,
                course: quiz.course,
                attemptNumber,
                answers: gradedAnswers,
                score: totalScore,
                timeSpent: timeSpent || 0
            };

            const newAttempt = await dao.createAttempt(attempt);
            res.json(newAttempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get attempt by ID
    const getAttemptById = async (req, res) => {
        try {
            const { attemptId } = req.params;
            const attempt = await dao.findAttemptById(attemptId);
            if (!attempt) {
                return res.status(404).json({ error: "Attempt not found" });
            }
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get all attempts for a quiz (faculty)
    const getQuizAttempts = async (req, res) => {
        try {
            const { quizId } = req.params;
            const attempts = await dao.findAttemptsByQuiz(quizId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Register routes
    app.get("/api/attempts/student/:studentId/quiz/:quizId", getStudentAttempts);
    app.get("/api/attempts/student/:studentId/quiz/:quizId/latest", getLatestAttempt);
    app.post("/api/attempts/quiz/:quizId", submitAttempt);
    app.get("/api/attempts/:attemptId", getAttemptById);
    app.get("/api/attempts/quiz/:quizId", getQuizAttempts);
}