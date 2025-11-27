import mongoose from "mongoose";

// Question Schema (嵌入式)
const questionSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    type: {
        type: String,
        enum: ['multipleChoice', 'trueFalse', 'fillInBlank'],
        required: true
    },
    title: { type: String, required: true },
    points: { type: Number, default: 1 },
    question: { type: String, required: true }, // HTML content

    // Multiple Choice fields
    choices: [{
        _id: { type: String },
        text: { type: String },
        isCorrect: { type: Boolean, default: false }
    }],

    // True/False field
    correctAnswer: { type: Boolean },

    // Fill in Blank fields
    possibleAnswers: [{ type: String }],
    caseSensitive: { type: Boolean, default: false }
});

// Quiz Schema
const quizSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        course: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },

        // Quiz Configuration
        quizType: {
            type: String,
            enum: ['GradedQuiz', 'PracticeQuiz', 'GradedSurvey', 'UngradedSurvey'],
            default: 'GradedQuiz'
        },
        points: { type: Number, default: 0 }, // Sum of all question points
        assignmentGroup: {
            type: String,
            enum: ['Quizzes', 'Exams', 'Assignments', 'Project'],
            default: 'Quizzes'
        },
        shuffleAnswers: { type: Boolean, default: true },
        timeLimit: { type: Number, default: 20 }, // minutes
        multipleAttempts: { type: Boolean, default: false },
        howManyAttempts: { type: Number, default: 1 },
        showCorrectAnswers: { type: String, default: "" },
        accessCode: { type: String, default: "" },
        oneQuestionAtTime: { type: Boolean, default: true },
        webcamRequired: { type: Boolean, default: false },
        lockQuestionsAfterAnswering: { type: Boolean, default: false },

        // Dates
        dueDate: { type: Date },
        availableDate: { type: Date },
        untilDate: { type: Date },

        // Status
        published: { type: Boolean, default: false },

        // Questions (embedded)
        questions: [questionSchema]
    },
    { collection: "quizzes" }
);

export default quizSchema;