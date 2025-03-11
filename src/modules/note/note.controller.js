import { Router } from "express";
import * as validators from "./note.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { authentication } from "./../../middleware/auth.middleware.js";
import {
  createNote,
  deleteAllNotes,
  deleteNote,
  getAggregatedNotes,
  getNote,
  getNoteByContent,
  getNoteWithUser,
  paginateNotes,
  replaceUserIdFromNOte,
  updateNote,
  updateTitleAllNotes,
} from "./services/note.service.js";
const router = Router();

router.post("/", validation(validators.createNote), authentication(), createNote);
router.patch("/:noteId", validation(validators.updateNote), authentication(), updateNote);
router.put("/replace/:noteId", validation(validators.replaceUserIdFromNOte), authentication(), replaceUserIdFromNOte);
router.put("/all", validation(validators.updateTitleAllNotes), authentication(), updateTitleAllNotes);
router.delete("/delete-all-notes", authentication(), deleteAllNotes);
router.delete("/:noteId", validation(validators.deleteNOte), authentication(), deleteNote);
router.get("/paginate-sort", authentication(), paginateNotes);
router.get("/note-by-content", authentication(), getNoteByContent);
router.get("/note-with-user", authentication(), getNoteWithUser);
router.get("/aggregate", authentication(), getAggregatedNotes);
router.get("/:noteId", authentication(), getNote);

export default router;
