import multer from 'multer';
import path from 'path';

// Storage for profile pictures
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/backend/uploads/profile_pictures/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Storage for post images
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/backend/uploads/posts/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer instances for profile pictures and post images
export const uploadProfile = multer({ storage: profileStorage });
export const uploadPost = multer({ storage: postStorage });


