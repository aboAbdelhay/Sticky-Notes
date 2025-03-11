import { successResponse } from "../../../utils/response/success.response.js";
import { asyncHandler } from "../../../utils/error/error.handling.js";
import userModel from "../../../DB/model/User.model.js";
import { generateEncryption } from "../../../utils/hash/encryption.js";
import { compareHash, generateHash } from "../../../utils/hash/hash.js";
import { generateToken } from "../../../utils/token/token.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, age } = req.body;

  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
  const encryptPhone = generateEncryption({ plainText: phone });
  const hashPassword = generateHash({ plainText: password, salt: 9 });
  await userModel.create({ name, email, password: hashPassword, phone: encryptPhone, age });
  return successResponse({
    res,
    status: 201,
    message: "User registered successfully",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !compareHash({ plainText: password, hashValue: user.password })) {
    return next(new Error("In-Valid Email or password", { cause: 404 }));
  }
  const token = generateToken({
    payload: { _id: user._id, isLoggedIn: true },
    signature: process.env.TOKEN_SIGNATURE,
    Option: {
      expiresIn: "1h",
      // "algorithm": "HS256",
    },
  });
  return successResponse({
    message: "Done",
    res,
    status: 200,
    token,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (await userModel.findOne({ email })) {
    return next(new Error("Email already exists", { cause: 400 }));
  }

  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return successResponse({
    res,
    message: "User updated successfully",
    status: 200,
    data: { user },
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.user._id);
  return successResponse({
    res,
    message: "user deleted",
    status: 200,
    data: { user },
  });
});
export const userProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return successResponse({
    res,
    status: 200,
    user,
  });
});
