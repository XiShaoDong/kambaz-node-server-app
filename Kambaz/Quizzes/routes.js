import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app, db) {
    const dao = QuizzesDao(db);

    // Get all quizzes (for testing)
    const findAllQuizzes = async (req, res) => {
        try {
            const quizzes = await dao.findAllQuizzes();
            res.json(quizzes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get quizzes for a specific course
    const findQuizzesForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const quizzes = await dao.findQuizzesForCourse(courseId);
            res.json(quizzes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Get a single quiz by ID
    const findQuizById = async (req, res) => {
        try {
            const { quizId } = req.params;
            const quiz = await dao.findQuizById(quizId);
            if (!quiz) {
                return res.status(404).json({ error: "Quiz not found" });
            }
            res.json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Create a new quiz
    const createQuiz = async (req, res) => {
        try {
            const { courseId } = req.params;
            const quiz = req.body;
            const newQuiz = await dao.createQuiz(quiz, courseId);
            res.json(newQuiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Update a quiz
    const updateQuiz = async (req, res) => {
        try {
            const { quizId } = req.params;
            const quizUpdates = req.body;
            const status = await dao.updateQuiz(quizId, quizUpdates);
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Delete a quiz
    const deleteQuiz = async (req, res) => {
        try {
            const { quizId } = req.params;
            const status = await dao.deleteQuiz(quizId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Toggle publish/unpublish quiz
    const togglePublishQuiz = async (req, res) => {
        try {
            const { quizId } = req.params;
            const quiz = await dao.togglePublishQuiz(quizId);
            if (!quiz) {
                return res.status(404).json({ error: "Quiz not found" });
            }
            res.json(quiz);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Add a question to quiz
    const addQuestion = async (req, res) => {
        try {
            const { quizId } = req.params;
            const question = req.body;
            const newQuestion = await dao.addQuestion(quizId, question);
            
            // Update total points
            await dao.updateQuizPoints(quizId);
            
            res.json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Update a question
    const updateQuestion = async (req, res) => {
        try {
            const { quizId, questionId } = req.params;
            const questionUpdates = req.body;
            const status = await dao.updateQuestion(quizId, questionId, questionUpdates);
            
            // Update total points
            await dao.updateQuizPoints(quizId);
            
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Delete a question
    const deleteQuestion = async (req, res) => {
        try {
            const { quizId, questionId } = req.params;
            const status = await dao.deleteQuestion(quizId, questionId);
            
            // Update total points
            await dao.updateQuizPoints(quizId);
            
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Register routes
    app.get("/api/quizzes", findAllQuizzes);
    app.get("/api/quizzes/course/:courseId", findQuizzesForCourse);
    app.get("/api/quizzes/:quizId", findQuizById);
    app.post("/api/quizzes/:courseId", createQuiz);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);
    app.put("/api/quizzes/:quizId/publish", togglePublishQuiz);
    
    // Question routes
    app.post("/api/quizzes/:quizId/questions", addQuestion);
    app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
    app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}