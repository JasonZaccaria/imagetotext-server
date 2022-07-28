var fs = require("fs"); //used to modify folders and files
var path = require("path");
var cron = require("node-cron");
function readUploads() {
    var parentPath = __dirname;
    var directoryPath = path.join(parentPath, "uploads");
    fs.readdir(directoryPath, { withFileTypes: true }, function (err, files) {
        if (err) {
            return console.log(err);
        }
        var _loop_1 = function (i) {
            if (!files[i].isDirectory()) {
                console.log(files[i].name);
                /*here we are iterating through the length of the files array we get back, and
                we are using an if statement to check if the file is a directory or not
                if it evaluates to false then we simply use fs.unlink to delete that file from the directory*/
                fs.unlink("".concat(directoryPath, "/").concat(files[i].name), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("".concat(files[i].name, " deleted from directory"));
                    }
                });
            }
        };
        for (var i = 0; i < files.length; i++) {
            _loop_1(i);
        }
    });
}
var task = cron.schedule("* 1 * * 1", function () {
    readUploads();
    console.log("cron job currently deleted files");
});
task.start();
