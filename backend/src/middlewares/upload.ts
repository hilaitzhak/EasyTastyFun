import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        if (!file) {
            throw new Error("No file provided");
        }
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'uploads'
        };
    }
});

// export const upload = multer({ storage }).array('images', 5);
export const upload = multer({ storage });