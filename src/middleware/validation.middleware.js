import joi from "joi";
import { Types } from "mongoose";

export const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("In-valid ObjectId");
};

export const generalFields = {
  name: joi.string().min(2).max(25).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid email",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),

  password: joi.string().required(),
  phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  age: joi.number().integer().min(18).max(60).required(), // Updated max age to 120
  userId: joi.string().custom(validateObjectId),
  noteId: joi.string().custom(validateObjectId),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputDate = { ...req.body, ...req.query, ...req.params };
    const validationError = schema.validate(inputDate, { abortEarly: false });
    if (validationError.error) {
      return res.status(400).json({
        message: "validation Error",
        validationError: validationError.error.details,
      });
    }
    return next();
  };
};
