import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
    const dao = AssignmentsDao(db);
    const findAllAssignments = async (req, res) => {
        const assignments = await dao.findAllAssignments();
        res.json(assignments);
    }

    const findAssignmentsForCurrentCourse = async (req, res) => {
        let { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCurrentCourse(courseId);
        res.json(assignments);
    }

    const createAssignments = async (req, res) => {
        const { courseId } = req.params;
        const assignment = req.body;
        const newAssignment = await dao.createAssignments(assignment, courseId);
        res.json(newAssignment)
    }

    const deleteAssignments = async (req, res) => {
        const { assignmentId} = req.params;
        const status = await dao.deleteAssignments(assignmentId);
        res.json(status);

    }

    const updateAssignments = async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = await dao.updateAssignments(assignmentId, assignmentUpdates);
        res.json(status);
    }

    app.put("/api/assignments/:assignmentId", updateAssignments);
    app.delete("/api/assignments/:assignmentId", deleteAssignments);
    app.post("/api/assignments/:courseId", createAssignments);
    app.get("/api/assignments/current/assignments/:courseId", findAssignmentsForCurrentCourse);
    app.get("/api/assignments", findAllAssignments);
}