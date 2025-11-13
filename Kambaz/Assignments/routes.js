import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
    const dao = AssignmentsDao(db);
    const findAllAssignments = (req, res) => {
        const assignments = dao.findAllAssignments();
        res.send(assignments);
    }

    const findAssignmentsForCurrentCourse = (req, res) => {
        let { courseId } = req.params;
        const assignments = dao.findAssignmentsForCurrentCourse(courseId);
        res.json(assignments);
    }

    const createAssignments = (req, res) => {
        const { courseId } = req.params;
        const assignment = req.body;
        const newAssignment = dao.createAssignments(assignment, courseId);
        res.send(newAssignment)
    }

    const deleteAssignments = (req, res) => {
        const { assignmentId} = req.params;
        const status = dao.deleteAssignments(assignmentId);
        res.send(status);

    }

    const updateAssignments = (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = dao.updateAssignments(assignmentId, assignmentUpdates);
        res.send(status);
    }

    app.put("/api/assignments/:assignmentId", updateAssignments);
    app.delete("/api/assignments/:assignmentId", deleteAssignments);
    app.post("/api/assignments/:courseId", createAssignments);
    app.get("/api/assignments/current/assignments/:courseId", findAssignmentsForCurrentCourse);
    app.get("/api/assignments", findAllAssignments);
}