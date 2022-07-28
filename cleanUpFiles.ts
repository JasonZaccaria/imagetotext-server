const fs = require("fs"); //used to modify folders and files
const path = require("path");
const cron = require("node-cron");

function readUploads(): void {
  const parentPath = __dirname;
  const directoryPath = path.join(parentPath, "uploads");
  fs.readdir(directoryPath, { withFileTypes: true }, (err: any, files: any) => {
    if (err) {
      return console.log(err);
    }
    for (let i = 0; i < files.length; i++) {
      if (!files[i].isDirectory()) {
        console.log(files[i].name);
        /*here we are iterating through the length of the files array we get back, and
        we are using an if statement to check if the file is a directory or not
        if it evaluates to false then we simply use fs.unlink to delete that file from the directory*/
        fs.unlink(`${directoryPath}/${files[i].name}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${files[i].name} deleted from directory`);
          }
        });
      }
    }
  });
}

let task = cron.schedule("* 1 * * 1", () => {
  readUploads();
  console.log("cron job currently deleted files");
});
task.start();
