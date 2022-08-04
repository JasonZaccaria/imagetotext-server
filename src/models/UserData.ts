import { pool } from "../services/pool";
const multer = require("multer");
const fs = require("fs"); //used to maodify folders and files
import { userDataObject } from "../services/Types";

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

class UserData {
  #email: string;
  #title: string;
  #stringConversion: string;
  #filename: string;
  #path: string;
  #copiedFilePath: string | null;
  #currentDate: Date = new Date();
  #mimetype: string;

  constructor(
    email: string,
    title: string,
    stringConversion: string,
    filename: string,
    path: string,
    mimetype: string
  ) {
    this.#email = email;
    this.#title = title;
    this.#stringConversion = stringConversion;
    this.#path = path;
    this.#copiedFilePath = `uploads/${email}/${filename}`;
    this.#filename = filename;
    this.#mimetype = mimetype;
  }

  get getEmail(): string {
    return this.#email;
  }

  set setEmail(newEmail: string) {
    this.#email = newEmail;
  }

  get getTitle() {
    return this.#title;
  }

  set setTitle(newTitle: string) {
    this.#title = newTitle;
  }

  get getStringConversion(): string {
    return this.#stringConversion;
  }

  set setStringConversion(newStringConversion: string) {
    this.#stringConversion = newStringConversion;
  }

  get getFilename(): string {
    return this.#filename;
  }

  set setFilename(newFilename: string) {
    this.#filename = newFilename;
  }

  get getPath(): string {
    return this.#path;
  }

  set setPath(newPath: string) {
    this.#path = newPath;
  }

  get getCopiedFilePath(): string | null {
    return this.#copiedFilePath;
  }

  set setCopiedFilePath(newCopiedFilePath: string) {
    this.#copiedFilePath = newCopiedFilePath;
  }

  get getCurrentDate(): Date {
    return this.#currentDate;
  }

  set setCurrentDate(newCurrentDate: Date) {
    this.#currentDate = newCurrentDate;
  }

  get getMimetype(): string {
    return this.#mimetype;
  }

  set setMimetype(newMimetype: string) {
    this.#mimetype = newMimetype;
  }

  async saveData(): Promise<userDataObject> {
    let dateInMis: Date = new Date();
    this.#currentDate = new Date(dateInMis);
    fs.copyFile(
      this.#path,
      `./uploads/${this.#email}/${this.#filename}`,
      (err: any) => {
        if (err) {
          console.log(err);
        }
        console.log("file copied to user directory");
      }
    );
    try {
      const results = pool.query(
        "INSERT INTO userposts (email, title, conversion, file, dates, mimetypes) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          this.#email,
          this.#title,
          this.#stringConversion,
          /*req.file.path,*/
          this.#copiedFilePath,
          this.#currentDate,
          this.#mimetype,
        ]
      );
      const resultTwo = await pool.query("SELECT * FROM userposts");
      console.table(resultTwo.rows);
      return { success: "data inserted into db" };
    } catch (err) {
      console.log("error occured");
      console.log(err);
      return { failure: "data could not be added to db" };
    }
  }
}

export default UserData;
