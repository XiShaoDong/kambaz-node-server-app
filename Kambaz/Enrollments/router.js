import EnrollmentsDao from "../Enrollments/dao.js";
export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);
    const addUserToCourse= (req, res) =>{
        let { userId, courseId } = req.params;
        // console.log(courseId,userId)
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const status = dao.enrollUserInCourse(userId,courseId)
        res.json(status);
    }

    const deleteUserFromCourse= (req, res) =>{
        let { userId,courseId } = req.params;
        // console.log(courseId,userId)

        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const status = dao.unEnrollUserInCourse(userId,courseId)
        res.json(status);
    }
    

    app.delete("/api/enrollment/:userId/:courseId", deleteUserFromCourse);
    app.post("/api/enrollment/:userId/:courseId", addUserToCourse);
}
