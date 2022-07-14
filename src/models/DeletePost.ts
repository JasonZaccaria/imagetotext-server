import { pool } from "../services/pool";
const fs = require("fs"); //used to manipulate folders and files
import { deletePostObject } from "../services/Types";

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
      fs.unlinkSync(removedPost);
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
