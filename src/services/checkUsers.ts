import { pool } from "./pool";

async function checkUsersTwo(user: string): Promise<boolean | undefined> {
  let userDuplicate: boolean = false;
  try {
    console.log("connected successfully");
    const results = await pool.query(
      "SELECT email FROM usertable WHERE email = $1",
      [user]
    );
    //testing what happens when unknown user is here
    console.log(results.rows);
    if (results.rows.length === 0) {
      console.log("no users with same name could be found");
      userDuplicate = false;
      return userDuplicate;
    } else if (results.rows.length === 1) {
      console.log("user with same email already in system");
      userDuplicate = true;
      return userDuplicate;
    }
  } catch (err) {
    console.log(
      "error could not query database | or could mean that no other user exitst so far so userDuplicate will equal false"
    );
    console.log(err);
    return undefined;
  }
}

export { checkUsersTwo };
