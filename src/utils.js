import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, __filename.originalname);
  },
});

export const uploader = multer({ storage });


export const dateShort = () => {
  let date = moment().format("HH:mm");
  return date;
};
