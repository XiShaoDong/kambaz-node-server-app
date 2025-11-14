import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;
        enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
    } 

    function unEnrollUserInCourse(userId, courseId) {
        db.enrollments = db.enrollments.filter(
            (e) => !(e.user === userId && e.course === courseId)
        );
        return { status: "ok" };
    }
    return { enrollUserInCourse, unEnrollUserInCourse };
}
