import { mongoose } from "mongoose";
import { Task } from "../../../DB/models/task.model.js";
import { User } from "../../../DB/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";

// 1-add task with status (toDo)(user must be logged in)
export const addTask = async (req, res, next) => {
  let userId = req.user._id;
  let { title, description, status, assignTo, deadline } = req.body;
  let isUser = await User.findById(assignTo);
  if (!isUser) return next(new Error("User You Assigned Not Found"));
  await Task.create({ title, description, status, userId, assignTo, deadline });
  return res.json({
    success: true,
    message: "Task Added To User Successfully",
  });
};
// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = async (req, res, next) => {
  let { taskId } = req.params;
  let userId = req.user._id;
  let { title, description, status, assignTo } = req.body;
  let isTask = await Task.findById(taskId);
  if (!isTask) return next(new Error("Task Not Found"));
  await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { title, description, status, assignTo }
  );
  return res.json({
    success: true,
    message: "Task Updated Successfully",
  });
};
// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = async (req, res, next) => {
  let { taskId } = req.params;
  let userId = req.user._id;
  let isTask = await Task.findById(taskId);
  if (!isTask) return next(new Error("Task Not Found"));
  await Task.findOneAndDelete(taskId, { userId });
  await cloudinary.uploader.destroy(isTask.taskAttachment.public_id);
  return res.json({
    success: true,
    message: "Task Deleted Successfully",
  });
};
// 4-get all tasks with user data
export const getTasks = async (req, res, next) => {
  let tasks = await Task.find().populate({
    path: "assignTo",
    select: "userName email phone -_id",
  });
  return res.json({ success: true, tasks });
};
// 5- get tasks of oneUser with user data (user must be logged in)
export const getUserTasks = async (req, res, next) => {
  let { _id } = req.user;
  let tasks = await Task.find({ assignTo: _id }).populate({
    path: "assignTo",
    select: "userName email phone -_id",
  });
  return res.json({ success: true, tasks });
};
// 6-get all tasks that not done after deadline
export const getDeadTasks = async (req, res, next) => {
  let currentDate = new Date();
  let tasks = await Task.find({
    status: { $ne: "done" },
    deadline: { $lt: currentDate },
  });
  return res.json({ success: true, tasks });
};
// Upload Attachment
export const uploadTaskAttachment = async (req, res, next) => {
  let { taskId } = req.params;
  let isTask = Task.findById(taskId);
  if (!isTask) return next(new Error("Task Not Found"));
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `trello/tasks/${taskId}` }
  );
  await Task.findByIdAndUpdate(taskId, {
    taskAttachment: { secure_url, public_id },
  });
  return res.json({
    success: true,
    message: "Task Attachment Uploaded Successfully",
  });
};
