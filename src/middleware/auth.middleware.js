import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js";
export const isAuthenticated = async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new Error("You Must Enter Token"));

  if (!token.startsWith("ali__"))
    return next(new Error("Bearer Token Is Invaild"));

  token = token.split("ali__")[1];
  const isToken = await Token.findOne({ token, isValid: true });
  if (!isToken) return next(new Error("Token Is Invaild"));

  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  let user = await User.findById(payload.id);
  if (!user) return next(new Error("Token was expired or deleted"));
  if (user.isDeleted)
    return next(
      new Error("User Was Deleted , Call Support If You Want To Return it")
    );
  req.user = user;

  return next();
};
