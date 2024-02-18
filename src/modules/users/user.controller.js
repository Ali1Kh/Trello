import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { forgetTemplate, signUpTemplate } from "../../utils/htmlTemplates.js";
import randomstring from "randomstring";
import cloudinary from "../../utils/cloudinary.js";
// 1-signUp
export const signUp = async (req, res, next) => {
  let { userName, email, password, confirmPassword, age, gender, phone } =
    req.body;
  let emailExist = await User.find({ email });
  let phoneExist = await User.find({ phone });
  if (emailExist.length > 0) {
    return next(new Error("Email Already Exist"));
  }
  if (phoneExist.length > 0) {
    return next(new Error("Phone Already Exist"));
  }
  let hashedPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  let user = await User.create({
    userName,
    email,
    password: hashedPassword,
    age,
    gender,
    phone,
  });
  const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET_KEY);
  let mailInfo = await sendEmail({
    to: email,
    subject: "Signup",
    html: signUpTemplate(userName, email, token),
  });
  if (!mailInfo) return next(new Error("Somthing Went Wrong"));
  return res.json({
    status: true,
    message: "Signed Up Successfully",
    user,
  });
};
// 2-login-->with create token
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return next(new Error("Invaild Email"));
  if (user.isDeleted)
    return next(
      new Error("User Was Deleted , Call Support If You Want To Return it")
    );
  if (!user.isConfirmed) return next(new Error("Email is Not Confirmed"));
  if (!bcryptjs.compareSync(password, user.password))
    return next(new Error("Invaild Password"));
  let token = jwt.sign(
    { id: user._id, email: user.email, name: user.userName },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: "25y" }
  );
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  return res.json({ success: true, message: "Logged In Successfully", token });
};
// 3-change password (user must be logged in)
export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword, rePassword } = req.body;
  let user = req.user;
  let checkPass = bcryptjs.compareSync(currentPassword, user.password);
  if (!checkPass) return next(new Error("Invaild Current Password"));
  if (newPassword != rePassword)
    return next(new Error("Password Confirmation Is invaild"));
  let hashedPassword = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  return res.json({ success: true, message: "Password Changed Successfully" });
};
// 4-update user (age , firstName , lastName)(user must be logged in)
export const updateUser = async (req, res, next) => {
  const { userName, age } = req.body;
  let user = req.user;
  await User.findByIdAndUpdate(user._id, { userName, age });
  return res.json({ success: true, message: "User Updated Successfully" });
};
// 5-delete user(user must be logged in)
export const deleteUser = async (req, res, next) => {
  let user = req.user;
  await cloudinary.api.delete_resources_by_prefix(
    `trello/profilePic/${req.user._id}`
  );
  await cloudinary.api.delete_resources_by_prefix(
    `trello/coverPics/${req.user._id}`
  );

  await User.findByIdAndDelete(user._id);
  return res.json({ success: true, message: "User Deleted Successfully" });
};
// 6-soft delete(user must be logged in)
export const softDeleteUser = async (req, res, next) => {
  let user = req.user;
  await User.findByIdAndUpdate(user._id, { isDeleted: true });
  return res.json({ success: true, message: "User Deleted Soft Successfully" });
};
// 7-logout
export const logout = async (req, res, next) => {
  const { token } = req.headers;
  await Token.findOneAndUpdate({ token }, { isValid: false });
  return res.json({ success: true, message: "Logged Out Successfully" });
};
//  activate Acc
export const confirmAccount = async (req, res, next) => {
  let { token } = req.params;
  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  await User.findOneAndUpdate({ email: payload.email }, { isConfirmed: true });
  res.json({ success: true, message: "Account Activated" });
};
// reset code
export const sendRestCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User Not Found"));
  if (!user.isConfirmed) return next(new Error("User Is Not Confirmed"));
  const code = randomstring.generate({ length: 5, charset: "numeric" });
  user.forgetCode = code;
  await user.save();
  let mailInfo = await sendEmail({
    to: user.email,
    subject: "Reset Account Password",
    html: forgetTemplate(code),
  });
  if (!mailInfo) return next(new Error("Somthing Went Wrong"));
  res.json({
    success: true,
    message: "Reset Code Sent To Your Email Successfully",
  });
};
// forget pass
export const forgetPass = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User Not Found"));
  if (user.forgetCode != req.body.resetCode)
    return next(new Error("Reset Code Is Invalid"));
  user.password = bcryptjs.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await user.save();
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  res.json({
    success: true,
    message: "Your Password Reseted Successfully",
  });
};

//upload profile pic
export const uploadProfilePic = async (req, res, next) => {
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `trello/profilePic/${req.user._id}` }
  );
  await User.findByIdAndUpdate(req.user._id, {
    profilePic: { secure_url, public_id },
  });
  return res.json({
    success: true,
    message: "Profile Image Uploaded Successfully",
  });
};

//upload cover pics
export const uploadCoverPics = async (req, res, next) => {
  let user = await User.findById(req.user._id);
  for (let index = 0; index < req.files.length; index++) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files[index].path,
      { folder: `trello/coverPics/${user._id}` }
    );
    user.coverPics.push({ secure_url, public_id });
  }
  await user.save();
  return res.json({
    success: true,
    message: "Cover Images Uploaded Successfully",
  });
};

export const deleteProfilePic = async (req, res, next) => {
  let user = await User.findById(req.user._id);
  await cloudinary.uploader.destroy(user.profilePic.public_id);
  await User.findByIdAndUpdate(req.user._id, {
    profilePic: { secure_url: null, public_id: null },
  });
  return res.json({
    success: true,
    message: "Profile Image Deleted Successfully",
  });
};
