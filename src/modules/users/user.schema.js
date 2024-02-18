import joi from "joi";

export const signUpSchema = joi
  .object({
    userName: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{3,10}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Please choose a Username containing only letters, between 3 and 10 characters.",
      }),
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm Password must be Equal main password.",
      }),
    age: joi.number().min(10).max(90).required().messages({
      "number.min": "Age Must Be More Than Or Equal 10",
      "number.max": "Age Must Be Less Than Or Equal 90",
    }),
    gender: joi
      .string()
      .uppercase()
      .valid("MALE", "FEMALE")
      .required()
      .messages({
        "any.only": "Gender Must Be One Of (male,female)",
      }),
    phone: joi
      .string()
      .min(11)
      .max(11)
      .pattern(new RegExp("^01[0125][0-9]{8}$"))
      .required()
      .messages({
        "string.min": "Phone Number Cannt be less than 11 Characters",
        "string.max": "Phone Number Cannt be more than 11 Characters",
        "string.pattern.base": "Please Enter Vaild Phone Number",
      }),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
  })
  .required();

export const changePassSchema = joi
  .object({
    currentPassword: joi.string().required(),
    newPassword: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    rePassword: joi.string().valid(joi.ref("newPassword")).required().messages({
      "any.only": "Confirm Password must be Equal Main password.",
    }),
  })
  .required();

export const updateUserSchema = joi
  .object({
    userName: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z]{3,10}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Please choose a Username containing only letters, between 3 and 10 characters.",
      }),
    age: joi.number().min(10).max(90).required().messages({
      "number.min": "Age Must Be More Than Or Equal 10",
      "number.max": "Age Must Be Less Than Or Equal 90",
    }),
  })
  .required();

export const confirmAccSchema = joi
  .object({ token: joi.string().required() })
  .required();

export const sendRestCodeSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
  })
  .required();

export const forgetPassSchema = joi
  .object({
    email: joi.string().email().required().messages({
      "string.email": "Please Enter Valid Email",
    }),
    resetCode: joi.string().length(5).required(),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(new RegExp("^[A-Z].{7,30}$"))
      .messages({
        "string.pattern.base": "Password Must Start With Capital Letter",
        "string.min": "Password Must Be At least 8 characters.",
      }),
    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm Password must be Equal main password.",
      }),
  })
  .required();
