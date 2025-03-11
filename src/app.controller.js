import { connectDB } from "./DB/connection.js";
import userController from "./modules/user/user.controller.js";
import noteController from "./modules/note/note.controller.js";
import { globalErrorHandling } from "./utils/error/error.handling.js";
import cors from "cors";
const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.use("/users", userController);
  app.use("/notes", noteController);
  app.use(globalErrorHandling);
  app.all("*", (req, res) => {
    return res.status(404).json({ message: "in-valid routing" });
  });
  connectDB();
};
export default bootstrap;
