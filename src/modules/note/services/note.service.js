import { asyncHandler } from "../../../utils/error/error.handling.js";
import { noteModel } from "../../../DB/model/note.model.js";
import { successResponse } from "../../../utils/response/success.response.js";
import userModel from "../../../DB/model/User.model.js";

export const createNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user._id;

  await noteModel.create({ title, content, userId });

  return successResponse({
    res,
    status: 201,
    message: "note created",
  });
});

export const updateNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user._id;
  const noteId = req.params.noteId;

  const note = await noteModel.findById(noteId);
  if (!note) {
    return next(new Error("note not found"));
  }
  if (note.userId.toString() !== userId.toString()) {
    return next(new Error("you are not the owner"));
  }
  const updatedNote = await noteModel.findByIdAndUpdate(noteId, { title, content }, { new: true, runValidators: true });

  return successResponse({
    res,
    status: 201,
    message: "update",
    note: updatedNote,
  });
});

export const replaceUserIdFromNOte = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const noteId = req.params.noteId;

  const note = await noteModel.findById(noteId);
  if (!note) {
    return next(new Error("note not found"));
  }
  if (note.userId.toString() !== userId.toString()) {
    return next(new Error("you are not the owner"));
  }
  if (!(await userModel.findById(req.body.userId))) {
    return next(new Error("userId not found"));
  }

  const updatedNote = await noteModel.findByIdAndUpdate(noteId, req.body, { new: true, runValidators: true });
  return successResponse({
    res,
    status: 201,
    message: "update",
    note: updatedNote,
  });
});

export const updateTitleAllNotes = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const userId = req.user._id;
  await noteModel.updateMany({ userId }, { title }, { runValidators: true });
  const updatedNotes = await noteModel.find({ userId });
  if (updatedNotes.length < 1) {
    return next(new Error("No note found"));
  }
  return successResponse({
    res,
    status: 201,
    message: "All notes updated",
  });
});
export const deleteNote = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const noteId = req.params.noteId;
  const note = await noteModel.findById(noteId);
  if (!note) {
    return next(new Error("note not found"));
  }
  if (note.userId.toString() !== userId.toString()) {
    return next(new Error("you are not the owner"));
  }
  await noteModel.findByIdAndDelete(noteId);

  return successResponse({
    res,
    status: 201,
    message: "deleted",
    note,
  });
});

export const paginateNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  let { page = 1, limit = 10, sortBy = "createdAt", orderBy = -1 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  orderBy = parseInt(orderBy);

  const sort = { [sortBy]: orderBy };
  const notes = await noteModel
    .find({ userId })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);
  if (notes.length < 1) {
    return next(new Error("No note found"));
  }
  return successResponse({
    res,
    status: 201,
    message: "notes",
    notes,
  });
});
export const getNote = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const noteId = req.params.noteId;
  const note = await noteModel.findById(noteId);
  if (!note) {
    return next(new Error("note not found"));
  }
  if (note.userId.toString() !== userId.toString()) {
    return next(new Error("you are not the owner"));
  }
  return successResponse({
    res,
    status: 201,
    message: "note",
    note,
  });
});
export const getNoteByContent = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { content } = req.query;
  const note = await noteModel.findOne({ userId, content });
  console.log(note);
  console.log(content);
  console.log(userId);

  if (!note) {
    return next(new Error("note not found"));
  }
  return successResponse({
    res,
    status: 201,
    message: "note",
    note,
  });
});

export const getNoteWithUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const notes = await noteModel.find({ userId }).select("title userId createdAt").populate({ path: "userId", select: "email" }).lean();
  if (!notes.length) {
    return next(new Error("No note found"));
  }
  const modifiedNotes = notes.map((note) => {
    note.userId = { email: note.userId.email };
    return note;
  });
  return successResponse({
    res,
    status: 201,
    message: "notes",
    notes: modifiedNotes,
  });
});

export const getAggregatedNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { title } = req.query;

  const matchStage = { $match: { userId } };
  if (title) {
    matchStage.$match.title = { $regex: title, $options: "i" };
  }

  const notes = await noteModel.aggregate([
    matchStage,
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        createdAt: 1,
        user: {
          name: "$user.name",
          email: "$user.email",
        },
      },
    },
  ]);

  if (!notes.length) {
    return res.status(200).json({ message: "No notes found", notes: [] });
  }

  return successResponse({
    res,
    status: 200,
    message: "Notes retrieved successfully",
    notes,
  });
});

export const deleteAllNotes = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const result = await noteModel.deleteMany({ userId });
  if (result.deletedCount === 0) {
    return next(new Error("No notes found to delete"));
  }

  return successResponse({
    res,
    status: 200,
    message: "All notes deleted successfully",
  });
});
