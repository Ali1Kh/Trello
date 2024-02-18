import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./DB/connection.js";
import usersRouter from "./src/modules/users/user.router.js";
import tasksRouter from "./src/modules/tasks/tasks.router.js";
dotenv.config();
const app = express();
const port = 3999;
app.use(express.json());
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
await dbConnect();
app.all("*", (req, res) => res.send("Not Found"));
app.use((error, req, res, next) => {
  return res.json({
    status: false,
    message: error.message,
    stack: error.stack,
  });
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
