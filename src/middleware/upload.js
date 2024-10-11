import multer from 'multer';
import path from 'path';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads')); // Set the destination to the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique file name
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Create the multer upload middleware
const upload = multer({ storage });

export default upload;
