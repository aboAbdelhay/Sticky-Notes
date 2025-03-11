import mongoose from "mongoose";
export const connectDB = async (req, res) => {
  await mongoose
    .connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000, // 30000ms = 30s
    })
    .then((res) => {
      console.log("DB Connected");
    })
    .catch((error) => {
      console.error("fail to connect on DB ,, err ", error);
    });
};
