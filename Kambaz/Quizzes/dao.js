import {v4 as uuidv4} from "uuid"
export default function QuizzesDao(db) {

    function createQuizzes(quiz, courseId){
        const newQ ={...quiz, _id:uuidv4(), courseId};
        db.quizzes = [...db.quizzes, newQ];
        console.log("@QDao create Q", newQ);

        return newQ;
    }

    function deleteQuizzes(quizId){
        const {quizzes} = db;

        db.quizzes = quizzes.filter((q) => q._id !== quizId);

    }

    function updateQuizzes(quizId, quizUpdates){
        const {quizzes} = db;
        const updatedQuiz = quizzes.find((q)=>q._id === quizId);
        Object.assign(updatedQuiz, quizUpdates);
        console.log("@Dao update Q",  
            `updatedQuiz: ${updatedQuiz}`, 
            `quizUpdates: ${quizUpdates}`);
        return updatedQuiz;
    }

    function findQuizesForCurrentCourse(courseId){
        const {quizzes} = db;
        const quizzesBelongCurrentCourse = quizzes.filter((q) => q.course === courseId);

        return quizzesBelongCurrentCourse;
    }

    return {
        createQuizzes,
        deleteQuizzes,
        updateQuizzes,
        findQuizesForCurrentCourse,
    }

}