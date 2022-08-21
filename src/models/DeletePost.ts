//import pool from "../services/pools";
const pool = require("../services/pools");
const fs = require("fs"); //used to modify folders and files
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
import { deletePostObject } from "../services/Types";

const config = {
  bucketName: process.env.AWS_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const s3 = new S3Client(config);

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

class DeletePost {
  #email: string;
  #titleOfPost: string;

  constructor(email: string, titleOfPost: string) {
    this.#email = email;
    this.#titleOfPost = titleOfPost;
  }

  get getEmail(): string {
    return this.#email;
  }

  set setEmail(newEmail: string) {
    this.#email = newEmail;
  }

  get getTitleOfPost(): string {
    return this.#titleOfPost;
  }

  set setTitleOfPost(newTitleOfPost: string) {
    this.#titleOfPost = newTitleOfPost;
  }

  async deletePosts(): Promise<deletePostObject> {
    try {
      const results = await pool.query(
        "SELECT file FROM userposts WHERE email = $1 AND title = $2",
        [this.#email, this.#titleOfPost]
      );
      console.table(results.rows[0]["file"]);
      let removedPost = results.rows[0]["file"];
      /*fs.unlinkSync(removedPost);*/
      //insert logic for deleting post
      let getFileOptions = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: removedPost,
      };
      //const getFile = new GetObjectCommand(getFileOptions);
      const getFile = new DeleteObjectCommand(getFileOptions);
      const response = await s3.send(getFile);
      const resultsTwo = await pool.query(
        "DELETE FROM userposts WHERE title = $1",
        [this.#titleOfPost]
      );
      return { success: "content has been sucessfully deleted" };
    } catch (err) {
      console.log(err);
      return { failure: "content could not be deleted" };
    }
  }
}

export default DeletePost;
