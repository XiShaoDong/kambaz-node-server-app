import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "dotenv/config";

import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/router.js";
import QuizzesRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptsRoutes from "./Kambaz/QuizAttempts/router.js";
import Lab5 from "./Lab5/index.js";
import Hello from "./Hello.js";

export const DEFAULT_CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

export async function connectDatabase(connectionString = DEFAULT_CONNECTION_STRING) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString);
  }
  return mongoose.connection;
}

export function createApp({
  connectionString = DEFAULT_CONNECTION_STRING,
  clientUrl = process.env.CLIENT_URL || "http://localhost:3000",
  sessionSecret = process.env.SESSION_SECRET || "kambaz",
  serverEnv = process.env.SERVER_ENV,
} = {}) {
  const app = express();

  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: clientUrl,
  //   })
  // );

  const allowedOriginPatterns = [
    /^http:\/\/localhost:3000$/,
    /^https:\/\/.*\.vercel\.app$/,
  ];

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOriginPatterns.some((pattern) =>
          pattern.test(origin)
        );

        if (isAllowed) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked: ${origin}`));
      },
    })
  );

  const sessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: connectionString,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };
  

  if (serverEnv !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie.sameSite = "none";
    sessionOptions.cookie.secure = true;
  }

  app.use(session(sessionOptions));
  app.use(express.json());

  UserRoutes(app);
  CourseRoutes(app, db);
  ModulesRoutes(app, db);
  AssignmentsRoutes(app, db);
  EnrollmentsRoutes(app, db);
  QuizzesRoutes(app, db);
  QuizAttemptsRoutes(app);
  Lab5(app);
  Hello(app);

  return app;
}

export default createApp;
