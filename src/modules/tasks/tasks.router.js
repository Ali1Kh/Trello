import { Router } from "express";
import * as tasksController from "./tasks.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  addTaskSchema,
  updateTaskSchema,
  uploadTaskAttachSchema,
} from "./tasks.schema.js";
import { fileValidation, uploadFiles } from "../../utils/multer.js";
let router = Router();

// 1-add task
router.post(
  "/",
  validation(addTaskSchema),
  asyncHandler(isAuthenticated),
  asyncHandler(tasksController.addTask)
);
// 2-update task
router.patch(
  "/:taskId",
  validation(updateTaskSchema),
  asyncHandler(isAuthenticated),
  asyncHandler(tasksController.updateTask)
);
// 3-delete task
router.delete(
  "/:taskId",
  asyncHandler(isAuthenticated),
  asyncHandler(tasksController.deleteTask)
);
// 4-get all tasks with user data
router.get("/", asyncHandler(tasksController.getTasks));
// 5-get tasks of oneUser with user data
router.get(
  "/userTasks",
  asyncHandler(isAuthenticated),
  asyncHandler(tasksController.getUserTasks)
);
// 6-get all tasks that not done after deadline
router.get("/deadTasks", asyncHandler(tasksController.getDeadTasks));
// Add Task Attachment
router.post(
  "/uploadTaskAttachment/:taskId",
  isAuthenticated,
  uploadFiles({ filter: fileValidation.files }).single("task"),
  validation(uploadTaskAttachSchema),
  asyncHandler(tasksController.uploadTaskAttachment)
);

export default router;
