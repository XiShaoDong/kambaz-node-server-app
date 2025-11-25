import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function UsersDao(db) {
    // let { users } = db;

    const createUser = (user) => {
        const newUser = { ...user, _id: uuidv4() };
        // users = [...users, newUser];
        return model.create(newUser);
    };

    const findAllUsers = () => model.find();

    const findUserById = (userId) => model.findById(userId);
    // .find((user) => user._id === userId);

    const findUsersByRole = (role) => model.find({ role: role });

    const findUsersByPartialName = (partialName) => {
        const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
        return model.find({
            $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
        });
    };

    const findUserByUsername = (username) => model.findOne({ username });
    // users.find((user) => user.username === username);

    const findUserByCredentials = (username, password) => model.findOne({ username, password });
    // users.find((user) => user.username === username && user.password === password);

    const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
    // model.findByIdAndUpdate(userId, user, {new: true})
    // (users = users.map((u) => (u._id === userId ? user : u)));

    const deleteUser = (userId) => model.deleteOne({ _id: userId });
    // model.findByIdAndDelete(userId);
    // (users = users.filter((u) => u._id !== userId));

    return {
        findUsersByPartialName, createUser, findAllUsers, findUserById, findUsersByRole, findUserByUsername, findUserByCredentials, updateUser, deleteUser
    };
}
