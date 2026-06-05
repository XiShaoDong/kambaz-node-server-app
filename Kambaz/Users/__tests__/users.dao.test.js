// import UsersDao from "../dao.js";
// import model from "../model.js";
// import { v4 as uuidv4 } from "uuid";

// jest.mock("../model.js");
// // jest.mock("uuid");


// uuidv4.mockReturnValue("mock-id");

// model.create.mockResolvedValue({
//   _id: "mock-id",
//   username: "alice"
// });

// test("createUser should call model.create with generated id", async()=> {
//     const dao = UsersDao();

//     const user = {username: "alice"};

//     const result = await dao.createUser(user);

//     expect(model.create).toHaveBeenCalledWith({
//         _id: "mock-id",
//         username: "alice"
//     });

//     expect(result).toEqual({
//           _id: "mock-id",
//         username: "alice" 
//     });

// });


// import UsersDao from "../dao.js";
// import model from "../model.js";

// jest.mock("../model.js");

// test("findAllUsers", async () => {
//     model.find.mockResolvedValue([
//         { username: "alice" }
//     ]);

//     const dao = UsersDao();

//     const result =
//         await dao.findAllUsers();

//     expect(model.find)
//         .toHaveBeenCalled();

//     expect(result)
//         .toEqual([
//             { username: "alice" }
//         ]);
// });


import UsersDao from "../dao.js";
import model from "../model.js";
import { jest } from "@jest/globals";

test("findAllUsers", async () => {
  // 使用 spyOn 拦截 model 对象上的 find 方法，并模拟返回值
  const findSpy = jest.spyOn(model, "find").mockResolvedValue([
    { username: "alice" }
  ]);

  const dao = UsersDao();
  const result = await dao.findAllUsers();

  // 断言 spy 被调用过
  expect(findSpy).toHaveBeenCalled();
  expect(result).toEqual([
    { username: "alice" }
  ]);

  // 手动恢复原函数，避免污染其他测试
  findSpy.mockRestore();
});