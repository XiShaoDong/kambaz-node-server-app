import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function AssignmentsDao(_db) {

    function createAssignments(assignment, courseId) {
        const newAssignment = { ...assignment, _id: uuidv4(), course: courseId };
        return model.create(newAssignment);
    }

    const deleteAssignments = (assignmentId) => model.deleteOne({ _id: assignmentId })

    const updateAssignments = (assignmentId, assignmentUpdates) => model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });

    const findAllAssignments = () => model.find();

    const findAssignmentsForCurrentCourse = (courseId) => model.find({course:courseId});

    return {
        createAssignments,
        deleteAssignments,
        updateAssignments,
        findAllAssignments,
        findAssignmentsForCurrentCourse,
    }

}
