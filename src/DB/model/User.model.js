import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, min: 18, max: 60 },
  },

  {
    timestamps: true,
  }
);
const userModel = mongoose.models.User || model("User", userSchema); 

export default userModel;
