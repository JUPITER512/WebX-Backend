import crypto from 'crypto'
import path from 'path'
import multer from 'multer'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Public');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fm = bytes.toString('hex') + path.extname(file.originalname);
            cb(null, fm);
        });
    }
});
export const upload = multer({ storage: storage })