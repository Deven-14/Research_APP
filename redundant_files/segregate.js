const LineReaderSync = require("line-reader-sync");
const fs = require("fs");
var lrs = new LineReaderSync(
  `../data_files/classroom_details.txt`
);
while (true) {
  var line = lrs.readline();
  if (line === null) {
    break;
  } else {
      var lst = line.split(", ")
      if(lst[1].trim() != "undefined")
      {
        fs.mkdir(`../data_files/${lst[0]}_${lst[1]}` ,{ recursive: true }, function(err) {
            if (err) {
              console.log(err)
            } else {
                fs.writeFile(`../data_files/${lst[0]}_${lst[1]}/class_details.txt`, '', function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
              console.log("New directory successfully created.")
          }
        })
      }
    else 
    {
        fs.mkdir(`../data_files/${lst[0]}_NA`, { recursive: true }, function(err) {
            if (err) {
            console.log(err)
            } else {
                fs.writeFile(`../data_files/${lst[0]}_NA/class_details.txt`, '', function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
            console.log("New directory successfully created.")
            }
        })

    }
  }
}
