import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {

    // Create a new quiz
    const createQuiz = (quiz, courseId) => {
        const newQuiz = {
            ...quiz,
            _id: uuidv4(),
            course: courseId,
            questions: [] // Initialize with empty questions array
        };
        return model.create(newQuiz);
    };

    // Delete a quiz
    const deleteQuiz = (quizId) => model.deleteOne({ _id: quizId });

    // Update quiz (including questions)
    const updateQuiz = (quizId, quizUpdates) => {
        return model.updateOne(
            { _id: quizId },
            { $set: quizUpdates }
        );
    };

    // Find all quizzes (for testing)
    const findAllQuizzes = () => model.find();

    // Find quizzes for a specific course
    const findQuizzesForCourse = (courseId) => {
        return model.find({ course: courseId });
    };

    // Find a single quiz by ID
    const findQuizById = (quizId) => model.findOne({ _id: quizId });

    // Publish/Unpublish quiz
    const togglePublishQuiz = async (quizId) => {
        const quiz = await model.findOne({ _id: quizId });
        if (!quiz) return null;

        quiz.published = !quiz.published;
        await quiz.save();
        return quiz;
    };

    // Add a question to quiz
    const addQuestion = async (quizId, question) => {
        const newQuestion = {
            ...question,
            _id: uuidv4(),
            // Multiple Choice: add _id to choices
            choices: question.type === "multipleChoice"
                ? (question.choices?.map(c => ({
                    ...c,
                    _id: c._id || uuidv4()
                })) || [])
                : undefined,
            // Fill in Blank: handle both new (blanks) and old (possibleAnswers) structure
            blanks: question.type === "fillInBlank" && question.blanks
                ? question.blanks
                : undefined,
            // Keep for backward compatibility with old fillInBlank questions
            possibleAnswers: question.possibleAnswers || [],
            correctAnswer: question.correctAnswer,
            caseSensitive: question.caseSensitive || false
        };

        const result = await model.updateOne(
            { _id: quizId },
            { $push: { questions: newQuestion } }
        );
        return newQuestion;
    };

    // Update a question in quiz
    const updateQuestion = async (quizId, questionId, questionUpdates) => {
        // Handle Multiple Choice choices
        if (questionUpdates.choices) {
            questionUpdates.choices = questionUpdates.choices.map(c => ({
                ...c,
                _id: c._id || uuidv4()
            }));
        }

        // Handle Fill in Blank blanks (new structure)
        // No special processing needed for blanks array, it will be saved as-is

        const result = await model.updateOne(
            { _id: quizId, "questions._id": questionId },
            { $set: { "questions.$": { ...questionUpdates, _id: questionId } } }
        );
        return result;
    };

    // Delete a question from quiz
    const deleteQuestion = async (quizId, questionId) => {
        const result = await model.updateOne(
            { _id: quizId },
            { $pull: { questions: { _id: questionId } } }
        );
        return result;
    };

    // Update quiz points (sum of all question points)
    const updateQuizPoints = async (quizId) => {
        const quiz = await model.findOne({ _id: quizId });
        if (!quiz) return null;

        const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await model.updateOne(
            { _id: quizId },
            { $set: { points: totalPoints } }
        );
        return totalPoints;
    };

    return {
        createQuiz,
        deleteQuiz,
        updateQuiz,
        findAllQuizzes,
        findQuizzesForCourse,
        findQuizById,
        togglePublishQuiz,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        updateQuizPoints
    };
}