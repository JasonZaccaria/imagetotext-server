import { Request, Response, Router } from "express";
const userDataRouter = Router();

app.get("/data", authenticateTokenTwo, async (req: any, res) => {
  //here we will authenticate user with access token and then we will decide to allow access or not
  //i changed the above function to include any for our req so we can access our req.user value that was blocked by teypescript fro some reasons
  try {
    let userDataArray: any = [];
    //const tetst = await pool.connect(); //gave random name for now but just testing
    const results = await pool.query(
      "SELECT * FROM userposts WHERE email = $1",
      [req.user.user]
    );
    const userTable = results.rows;
    //just added this commit statement below to see if this helps
    //await pool.query("COMMIT");
    //tetst.release(); //i have to release this cleint instance. I shoudl reneame this and the tetst above to client and that shoudl be more claers
    //await tetst.end();
    //results.end();
    async function tester() {
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

    let datar = await tester();
    console.log(datar);

    //console.log(userDataArray);
    res.json({ image: userDataArray }); //error becuae the reafile is async we need to await it somewhow so we send this after not before
    //changes end here 6/21/2022
  } catch (e) {
    console.log(e);
    res.json({ failure: "could not retrieve userdata from /data route" });
  }
});

app.post("/imageconvert", upload.single("file"), async (req: any, res) => {
  //above we included the multer middleware to allow us to upload a file called file which is passed to req
  //below we call our imageToText function with the path of the downloaded image inside of the uploads folder and return the text as a response
  console.log(req.file);
  const convertedImage: string = await imageToText(req.file["path"]);
  res.json({ success: convertedImage });
});

app.post(
  "/userdata",
  authenticateTokenTwo,
  upload.single("file"),
  async (req: any, res: any) => {
    console.log(req.file); //we need to save user file as an item in a column
    console.log(req.user.user); //we need to save user email as a item in a column
    console.log(req.body.user); //this won't work we need to grab user from authentication middlewar we used
    const userString = req.body.user;
    console.log(req.body.stringConversion);
    console.log(req.body.title);
    console.log(req.body.title);
    console.log(req.body);
    console.log(req.title);
    let dateInMs = new Date();
    console.log(dateInMs.getTime());
    let currentDate = new Date(dateInMs); //we also need to save a timestamp to use for later also in a column
    console.log(currentDate);
    //and lastly we will need to save a conversion post name as a column
    console.log(req.file.path);
    console.log(req.file.mimetype);
    //changes for 6/20/here
    fs.copyFile(
      req.file.path,
      `./uploads/${req.user.user}/${req.file.filename}`,
      (err: any) => {
        if (err) {
          console.log(err);
        }
        console.log("file copied to user directory");
      }
    );
    let copiedFilePath = `uploads/${req.user.user}/${req.file.filename}`;
    //changes for 6/20 end here

    try {
      //const client = await pool.connect();
      const results = await pool.query(
        "INSERT INTO userposts (email, title, conversion, file, dates, mimetypes) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          req.user.user,
          req.body.title,
          req.body.stringConversion,
          /*req.file.path,*/
          copiedFilePath,
          currentDate,
          req.file.mimetype,
        ]
      );
      //results.release();
      const resultTwo = await pool.query("SELECT * FROM userposts");
      console.table(resultTwo.rows);
      //await client.query("COMMIT");
      //client.end();
      //resultTwo.release();
    } catch (e) {
      console.log("error occured");
      console.log(e);
    }
  }
);

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

export { userDataRouter };
