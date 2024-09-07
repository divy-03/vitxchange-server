import mongoose from "mongoose";

export async function connectToAtlas() {
  try {
    await mongoose.connect(String(process.env.ATLAS_URI));

    mongoose.connection.once("open", () => {
      console.log("Successfully connected to MongoDB Atlas!");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to MongoDB Atlas:", err);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1); // Exit the process with failure code if connection fails
  }
}

export default mongoose;
