import { Router } from "express";
import * as validators from "./user.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { deleteUser, login, signup, updateProfile, userProfile } from "./services/user.service.js";
import { authentication } from './../../middleware/auth.middleware.js';
const router = Router();

router.post("/signup", validation(validators.signup), signup);
router.post("/login", validation(validators.login), login);
router.patch("/", validation(validators.updateProfile), authentication(), updateProfile);
router.delete("/", authentication(), deleteUser);
router.get("/", authentication(), userProfile);

export default router;
