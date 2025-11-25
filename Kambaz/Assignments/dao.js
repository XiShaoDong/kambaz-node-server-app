import { v4 as uuidv4 } from "uuid";
export default function AssignmentsDao(db) {

    function createAssignments(assignment, courseId){
        const newAssignment = {...assignment, _id: uuidv4(), course: courseId};
        db.assignments = [...db.assignments, newAssignment];
        console.log("@Dao createAssignment",newAssignment)

        return newAssignment;
    }   

    function deleteAssignments(assignmentId){
        const {assignments} = db;
        //@Check need match both courseId and assignmentId
        db.assignments = assignments.filter((a) => (a._id !== assignmentId));

     }

    function updateAssignments(assignmentId, assignmentUpdates){
        const {assignments} = db;
        const updatedAssignment = assignments.find ((a) => a._id === assignmentId);
        Object.assign(updatedAssignment, assignmentUpdates);
        console.log("@Dao updateAssignment",assignmentUpdates)
        return updatedAssignment;

    }

    function findAllAssignments(){
        return db.assignments;
    }

    function findAssignmentsForCurrentCourse(courseId){
        const {assignments} = db;
        const assignmentsBelongCurrentCouse = assignments.filter((a) => a.course === courseId);
        return assignmentsBelongCurrentCouse
    }

    return {
        createAssignments,
        deleteAssignments,
        updateAssignments,
        findAllAssignments,
        findAssignmentsForCurrentCourse,
    }

}
