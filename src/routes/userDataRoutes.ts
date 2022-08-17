import { Request, Response, Router } from "express";
import { authenticateTokenTwo } from "../services/authenticateToken";
import dataController from "../controllers/DataController";
import userDataController from "../controllers/UserDataController";
import deletePostController from "../controllers/DeletePostController";
import imageToText from "../services/textGenerator";
const multer = require("multer"); //for multipart form data i need it
const multerS3 = require("multer-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const userDataRouter = Router();

/*onst storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage });*/

const config = {
  bucketName: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const s3 = new S3Client(config);
//possibly need to change uploads/ to allow for usernames to be added afterwards???
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: any, file: any, cb: any) {
      cb(null, "uploads/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

userDataRouter.get("/data", authenticateTokenTwo, dataController);

userDataRouter.post(
  "/imageconvert",
  upload.single("file"),
  async (req: any, res) => {
    //above we included the multer middleware to allow us to upload a file called file which is passed to req
    //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
    console.log(req.file);
    const convertedImage: string = await imageToText(
      req.file.location /*req.file["path"]*/
    );
    res.json({ success: convertedImage });
  }
);

userDataRouter.post(
  "/userdata",
  authenticateTokenTwo,
  upload.single("file"),
  userDataController
);

userDataRouter.post("/deletePost", authenticateTokenTwo, deletePostController);

export { userDataRouter };
