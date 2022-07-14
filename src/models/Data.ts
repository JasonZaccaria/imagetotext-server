import { pool } from "../services/pool";
const fs = require("fs"); //used to manipulate folders and files
import { dataObject } from "../services/Types";

//this class retrieves the data from the db and sends it back to the user
class Data {
  #email: string;
  constructor(email: string) {
    this.#email = email;
  }

  get getEmail(): string {
    return this.#email;
  }

  set setEmail(newEmail: string) {
    this.#email = newEmail;
  }

  async getData(): Promise<dataObject> {
    try {
      let userDataArray: any[] = [];
      const results = await pool.query(
        "SELECT * FROM userposts WHERE email = $1",
        [this.#email]
      );
      const userTable = results.rows;
      async function enterData() {
        for (let i = 0; i < userTable.length; i++) {
          let tempData = fs.readFileSync(userTable[i]["file"]);
          let base64 = tempData.toString("base64");
          userDataArray.push([
            userTable[i]["title"],
            userTable[i]["conversion"],
            base64,
            userTable[i]["dates"],
            userTable[i]["mimetypes"],
          ]);
          console.log(userDataArray);
        }
        return userDataArray;
      }
      let data = await enterData();
      console.log(data);
      return { image: userDataArray };
    } catch (err) {
      console.log(err);
      return { failure: "could not retrieve userdata from database" };
    }
  }
}

export default Data;
