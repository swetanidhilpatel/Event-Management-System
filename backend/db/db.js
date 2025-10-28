import mongoose from "mongoose";

export const mongoDB = async () => {
  try {
    const host = await mongoose.connect(process.env.MONGODB_URL);

    console.log("mongodb connected " + host.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};