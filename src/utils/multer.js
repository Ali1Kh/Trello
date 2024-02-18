import multer, { diskStorage } from "multer";

export const fileValidation = {
  images: ["image/png", "image/jpg"],
  files: ["application/pdf"],
};

export function uploadFiles({ filter }) {
    const storage = diskStorage({});
    const fileFilter = (req, file, cb) => {
      if (!filter.includes(file.mimetype)) {
        return cb(new Error("Invaild File Format"), false);
      }
      return cb(null, true);
    };
    const multerUpload = multer({ storage, fileFilter });
    return multerUpload;
}
