import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/public/product/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extName) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg, jpeg, png formats allowed!"));
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, 
});

export default upload;
