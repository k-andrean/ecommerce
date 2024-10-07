import multer from 'multer';
import path from 'path';

// Set storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Initialize multer
const upload = multer({ storage: storage });

export default upload;