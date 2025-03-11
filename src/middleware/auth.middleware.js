import userModel from "../DB/model/User.model.js";
import { asyncHandler } from "../utils/error/error.handling.js";
import { verifyToken } from "../utils/token/token.js";

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }
    const decoded = verifyToken({ token: authorization, signature: process.env.TOKEN_SIGNATURE });

    if (!decoded?._id) {
      return next(new Error("Invalid token", { cause: 400 }));
    }
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }

    req.user = user;
    next();
  });
};
