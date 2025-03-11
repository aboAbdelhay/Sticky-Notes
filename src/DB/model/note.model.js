import mongoose, { model, Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v !== v.toUpperCase();
        },
        message: "Title should not be all uppercase",
      },
    },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    // versionKey: false
  }
);
export const noteModel = mongoose.models.note || model("note", noteSchema);
