import joi from "joi";
import { ObjectIdValidate } from "../../middleware/validation.middleware.js";

export const addTaskSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().required(),
    status: joi.string().uppercase().valid("TODO").required().messages({
      "any.only": "Status Must Be TODO While Adding",
    }),
    assignTo: joi.custom(ObjectIdValidate).required(),
    deadline: joi.date().required(),
  })
  .required();

export const updateTaskSchema = joi
  .object({
    taskId: joi.custom(ObjectIdValidate).required(),
    title: joi.string().required(),
    description: joi.string().required(),
    status: joi
      .string()
      .uppercase()
      .valid("TODO", "DOING", "DONE")
      .required()
      .messages({
        "any.only": "Status Must Be toDo, doing or done While Updating",
      }),
    assignTo: joi.custom(ObjectIdValidate).required(),
  })
  .required();

export const uploadTaskAttachSchema = joi
  .object({
    taskId: joi.custom(ObjectIdValidate).required(),
  })
  .required();
