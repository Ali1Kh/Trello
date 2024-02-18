import mongoose from "mongoose";

export async function dbConnect() {
  await mongoose
    .connect(process.env.CONNECION_URL + "to-do-list")
    .then(() => {
      console.log("Connected To Mongo Successfully");
    })
    .catch((error) => {
      console.log("Connection Failed : ", error);
    });
}
