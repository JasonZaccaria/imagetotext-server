import { pool } from "../services/pool";
const fs = require("fs"); //used to manipulate folders and files

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

app.post("/deletePost", authenticateTokenTwo, async (req: any, res) => {
  let titleOfPost: string = req.body.titleOfPost;
  try {
    //below we grab the file directory from our
    //const client = await pool.connect();
    const results = await pool.query(
      "SELECT file FROM userposts WHERE email = $1 AND title = $2",
      [req.user.user, titleOfPost]
    );
    //results.release();
    console.table(results.rows[0]["file"]);
    let removedPost = results.rows[0]["file"];
    fs.unlinkSync(removedPost);
    //below we are deleting the rows that contain our post's title form our db
    const resultsTwo = await pool.query(
      "DELETE FROM userposts WHERE title = $1",
      [titleOfPost]
    );
    //client.end();
    //resultsTwo.release();
  } catch (e) {
    console.log(e);
  }
  res.json({ success: "content deleted from db" });
});

export default DeletePost;
