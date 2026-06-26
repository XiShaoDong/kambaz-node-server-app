import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        quiz: { type: String, required: true }, // Quiz ID
        student: { type: String, required: true }, // Student ID
        course: { type: String, required: true }, // Course ID
        attemptNumber: { type: Number, default: 1 },

        // Answers array
        answers: [{
            question: { type: String, required: true }, // Question ID
            answer: mongoose.Schema.Types.Mixed, // Can be String, Boolean, or Array
            isCorrect: { type: Boolean, default: false },
            pointsEarned: { type: Number, default: 0 }
        }],

        score: { type: Number, default: 0 }, // Total score
        submittedAt: { type: Date, default: Date.now },
        timeSpent: { type: Number, default: 0 } // in seconds
    },
    { collection: "quizAttempts" }
);

export default quizAttemptSchema;