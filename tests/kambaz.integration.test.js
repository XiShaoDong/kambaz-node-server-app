import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDatabase, createApp } from "../app.js";

let mongoServer;
let app;
let agent;

async function clearDatabase() {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

describe("Kambaz API integration", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectDatabase(uri);
    app = createApp({
      connectionString: uri,
      clientUrl: "http://localhost:3000",
      sessionSecret: "test-secret",
      serverEnv: "development",
    });
    agent = request.agent(app);
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("supports signup, signin and profile lookup with session cookies", async () => {
    const user = {
      username: "test_student",
      password: "pw123",
      firstName: "Test",
      lastName: "Student",
      role: "STUDENT",
    };

    await request(app).post("/api/users").send(user).expect(200);

    const signinResponse = await agent
      .post("/api/users/signin")
      .send({ username: user.username, password: user.password })
      .expect(200);

    expect(signinResponse.body.username).toBe(user.username);

    const profileResponse = await agent.post("/api/users/profile").expect(200);
    expect(profileResponse.body).toMatchObject({ username: user.username });
  });

  it("creates a quiz, grades an attempt and increments attempt numbers", async () => {
    const courseId = "cs5000";
    const quizResponse = await request(app)
      .post(`/api/quizzes/${courseId}`)
      .send({
        title: "Midterm Practice",
        description: "Integration test quiz",
        published: true,
        questions: [],
      })
      .expect(200);

    const quizId = quizResponse.body._id;

    const mcQuestion = await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        type: "multipleChoice",
        title: "MC",
        points: 5,
        question: "Pick A",
        choices: [
          { text: "A", isCorrect: true },
          { text: "B", isCorrect: false },
        ],
      })
      .expect(200);

    const tfQuestion = await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        type: "trueFalse",
        title: "TF",
        points: 4,
        question: "Sky is blue",
        correctAnswer: true,
      })
      .expect(200);

    const fibQuestion = await request(app)
      .post(`/api/quizzes/${quizId}/questions`)
      .send({
        type: "fillInBlank",
        title: "FIB",
        points: 6,
        question: "<p>The capital is [blank0]</p>",
        blanks: [
          {
            id: "blank0",
            possibleAnswers: ["Paris"],
            caseSensitive: false,
          },
        ],
      })
      .expect(200);

    const answers = [
      {
        question: mcQuestion.body._id,
        answer: mcQuestion.body.choices[0]._id,
      },
      {
        question: tfQuestion.body._id,
        answer: true,
      },
      {
        question: fibQuestion.body._id,
        answer: { blank0: "paris" },
      },
    ];

    const firstAttempt = await request(app)
      .post(`/api/attempts/quiz/${quizId}`)
      .send({
        studentId: "student-1",
        answers,
        timeSpent: 42,
      })
      .expect(200);

    expect(firstAttempt.body.score).toBe(15);
    expect(firstAttempt.body.attemptNumber).toBe(1);

    const secondAttempt = await request(app)
      .post(`/api/attempts/quiz/${quizId}`)
      .send({
        studentId: "student-1",
        answers,
        timeSpent: 55,
      })
      .expect(200);

    expect(secondAttempt.body.attemptNumber).toBe(2);

    const attemptsResponse = await request(app)
      .get(`/api/attempts/student/student-1/quiz/${quizId}`)
      .expect(200);

    expect(attemptsResponse.body).toHaveLength(2);
    expect(attemptsResponse.body[0].attemptNumber).toBe(2);
  });
});
