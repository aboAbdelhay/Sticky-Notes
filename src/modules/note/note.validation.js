import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createNote = joi
  .object()
  .keys({
    title: joi.string().required(),
    content: joi.string().required(),
  })
  .options({ allowUnknown: false })
  .required();

export const updateNote = joi
  .object()
  .keys({
    title: joi.string().required(),
    content: joi.string().required(),
    noteId: generalFields.noteId.required(),
  })
  .options({ allowUnknown: false })
  .required();
export const replaceUserIdFromNOte = joi
  .object()
  .keys({
    title: joi.string().required(),
    content: joi.string().required(),
    noteId: generalFields.noteId.required(),
    userId: generalFields.userId.required(),
  })
  .options({ allowUnknown: false })
  .required();

export const updateTitleAllNotes = joi
  .object()
  .keys({
    title: joi.string().required(),
    userId: generalFields.userId,
  })
  .options({ allowUnknown: false })
  .required();
export const deleteNOte = joi
  .object()
  .keys({
    noteId: generalFields.noteId.required(),
  })
  .options({ allowUnknown: false })
  .required();
// export const allNotes = joi
//   .object()
//   .keys({
//     userId: generalFields.userId.required(),
//     sort: joi.string().valid("asc", "desc").required(),
//     page: joi.number().required(),
//     limit: joi.number().required(),

//   })
//   .options({ allowUnknown: false })
//   .required();
