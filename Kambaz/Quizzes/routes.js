import QuizzesDao from "./dao.js";
export default function QuizzesRoutes(app, db) {
    const dao = QuizzesDao(db);
    const findQuizzesForCurrentCourse = (req, res) => {
        let { courseId } = req.params;
        const quizzes = dao.findQuizesForCurrentCourse(courseId);
        res.json(quizzes)
    }

    const createQuiz= (req, res) => {
        const { courseId } = req.params;
        const { newQuizContent } = req.body;
        const newQuiz = dao.createQuizzes(newQuizContent, courseId);
        res.json(newQuiz);
    }

    const deleteQuizzes = (req, res) => {
        const { quizId } = req.params;
        const status = dao.deleteQuizzes(quizId);
        res.json(status);
    }

    const updateQuizzes = (req, res) => {
        const { quizId } = req.params;
        const { quizUpdateContent } = req.body;
        const status = dao.updateQuizzes(quizId, quizUpdateContent);
        res.json(status)
    }


    app.post("/api/quizzes/:courseId", createQuiz)
    app.delete("/api/quizzes/:quizId", deleteQuizzes);
    app.put("/api/quizzes/:quizId", updateQuizzes);
    app.get("/api/quizzes/current/quizzes/:courseId", findQuizzesForCurrentCourse);


}