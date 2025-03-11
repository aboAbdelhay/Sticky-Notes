import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const updateProfile = joi
  .object()
  .keys({
    name: generalFields.name,

    email: generalFields.email,

    phone: generalFields.phone,
    age: generalFields.age,
  })
  .required();

export const signup = joi
  .object()
  .keys({
    name: generalFields.name.required(),
    email: generalFields.email.required(),

    password: generalFields.password.required(),
    phone: generalFields.phone.required(),
    age: generalFields.age.required(),
  })
  .options({ allowUnknown: false })
  .required();

export const login = joi
  .object()
  .keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .options({ allowUnknown: false })
  .required();
