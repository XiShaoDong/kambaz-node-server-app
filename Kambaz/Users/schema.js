import mongoose, { now } from "mongoose";

const userSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: {type: String, unique: true},
    lastName: String,
    dob: Date,
    role: {
        type: String,
        enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
        default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
    createdAt:{type: Date, default: Date,now},
},
    { collection: "users" }
);
export default userSchema;