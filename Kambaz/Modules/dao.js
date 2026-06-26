import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
export default function ModulesDao(_db) {
    async function findModulesForCourse(courseId) {
        const course = await model.findById(courseId);
        return course.modules;
    }
    async function createModule(courseId, module) {
        const newModule = { ...module, _id: uuidv4() };
        const _status = await model.updateOne(
            { _id: courseId },
            { $push: { modules: newModule } }
        );

        return newModule;
    }

    async function deleteModule(courseId, moduleId) {
        const _status = await model.updateOne(
            { _id: courseId },
            { $pull: { modules: { _id: moduleId } } }
        );
        return _status;
    }

    async function updateModule(courseId, moduleId, moduleUpdates) {
        const course = await model.findById(courseId);
        const module = course.modules.id(moduleId);
        Object.assign(module, moduleUpdates);
        await course.save();
        return module;
    }


    return {
        findModulesForCourse,
        createModule,
        deleteModule,
        updateModule,
    };
}
