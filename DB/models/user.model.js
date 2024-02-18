import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, minLength: 8, required: true },
  age: { type: Number, min: 10, max: 90, required: true },
  gender: { type: String, required: true },
  phone: { type: String, unique: true, maxLength: 11, minLength: 11 },
  isDeleted: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false },
  forgetCode: { type: String},
  profilePic: { secure_url: String, public_id: String },
  coverPics: [{ secure_url: String, public_id: String }],

});

export const User = model("Users", userSchema);
