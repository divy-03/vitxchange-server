import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect(String(process.env.MONGODB_URI))
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log("Error conecting to DB:", error);
    });
};

export default connectDatabase;
