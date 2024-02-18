import { Router } from "express";
import * as userController from "./user.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  changePassSchema,
  confirmAccSchema,
  forgetPassSchema,
  loginSchema,
  sendRestCodeSchema,
  signUpSchema,
  updateUserSchema,
} from "./user.schema.js";
import { fileValidation, uploadFiles } from "../../utils/multer.js";
let router = Router();

router.post(
  "/signUp",
  validation(signUpSchema),
  asyncHandler(userController.signUp)
);
router.post(
  "/login",
  validation(loginSchema),
  asyncHandler(userController.login)
);
router.patch(
  "/changePassword",
  validation(changePassSchema),
  asyncHandler(isAuthenticated),
  asyncHandler(userController.changePassword)
);

router.patch(
  "/updateUser",
  validation(updateUserSchema),
  asyncHandler(isAuthenticated),
  asyncHandler(userController.updateUser)
);
router.delete(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(userController.deleteUser)
);
router.post(
  "/logout",
  asyncHandler(isAuthenticated),
  asyncHandler(userController.logout)
);
router.delete(
  "/softDelete",
  asyncHandler(isAuthenticated),
  asyncHandler(userController.softDeleteUser)
);

router.get(
  "/confirmAccount/:token",
  validation(confirmAccSchema),
  asyncHandler(userController.confirmAccount)
);

router.patch(
  "/resetCode",
  validation(sendRestCodeSchema),
  asyncHandler(userController.sendRestCode)
);

router.patch(
  "/forgetPass",
  validation(forgetPassSchema),
  asyncHandler(userController.forgetPass)
);

router.post(
  "/uploadProfilePic",
  isAuthenticated,
  uploadFiles({ filter: fileValidation.images }).single("pic"),
  asyncHandler(userController.uploadProfilePic)
);

router.post(
  "/uploadCoverPics",
  isAuthenticated,
  uploadFiles({ filter: fileValidation.images }).array("coverPics", 4),
  asyncHandler(userController.uploadCoverPics)
);

router.delete(
  "/deleteProfilePic",
  isAuthenticated,
  asyncHandler(userController.deleteProfilePic)
);




export default router;
