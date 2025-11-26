import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: String,
        description: String,
        startDate: Date,
        dueDate: Date,
        points: String,
    },
    { collection: "assignments" }
);
export default assignmentSchema;