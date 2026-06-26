import "dotenv/config";
import { connectDatabase, createApp, DEFAULT_CONNECTION_STRING } from "./app.js";

const connectionString = process.env.DATABASE_CONNECTION_STRING || DEFAULT_CONNECTION_STRING;
await connectDatabase(connectionString);

const app = createApp({ connectionString });
app.listen(process.env.PORT || 4001);
