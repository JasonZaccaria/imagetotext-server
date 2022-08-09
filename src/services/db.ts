import pool from "./pools";

async function db(userEmail: any, userPassword: any): Promise<void> {
  try {
    //const client = await pool.connect();
    console.log("conneccted successfully");
    const results = await pool.query(
      "INSERT INTO usertable(email, password) VALUES($1, $2)",
      [userEmail, userPassword]
    );
    const resultTwo = await pool.query("SELECT * FROM usertable");
    console.table(resultTwo.rows);
    console.log("client disconnected");
  } catch (e) {
    console.log(`failed to execute ${e}`);
  }
}

export { db };
