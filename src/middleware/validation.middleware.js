import { Types } from "mongoose";

export const ObjectIdValidate = (val, helper) => {
  if (Types.ObjectId.isValid(val)) return true;
  return helper.message("Invalid Object Id");
};
export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    let validationResult = schema.validate(data);
    if (validationResult.error) {
      let errors = validationResult.error.details.map((error) => error.message);
      return next(new Error(errors));
    }
    return next();
  };
};
