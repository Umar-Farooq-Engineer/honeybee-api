// Multer setup (for file upload)
const multer=require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in /uploads folder
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

module.exports=upload;