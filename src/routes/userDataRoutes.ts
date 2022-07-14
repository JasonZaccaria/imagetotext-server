import { Request, Response, Router } from "express";
import { authenticateTokenTwo } from "../services/authenticateToken";
import dataController from "../controllers/DataController";
import userDataController from "../controllers/UserDataController";
import deletePostController from "../controllers/DeletePostController";
import imageToText from "../services/textGenerator";
const multer = require("multer"); //for multipart form data i need it
const userDataRouter = Router();

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname /*+ "-" + uniqueSuffix*/);
  },
});

let upload = multer({ storage: storage });

userDataRouter.get("/data", authenticateTokenTwo, dataController);

userDataRouter.post(
  "/imageconvert",
  upload.single("file"),
  async (req: any, res) => {
    //above we included the multer middleware to allow us to upload a file called file which is passed to req
    //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
    console.log(req.file);
    const convertedImage: string = await imageToText(req.file["path"]);
    res.json({ success: convertedImage });
  }
);

userDataRouter.post("/userdata", authenticateTokenTwo, userDataController);

userDataRouter.post("/deletePost", authenticateTokenTwo, deletePostController);

export { userDataRouter };
