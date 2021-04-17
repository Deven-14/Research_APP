const LineReaderSync = require("line-reader-sync");
const fs = require("fs");
var final_list = [];
var lrs = new LineReaderSync("student_details.txt");
while (true) {
  var line = lrs.readline();
  if (line === null) {
    break;
  } else {
    var list = line.split("**");
    if (
      list[0] != "102641484502798472042" &&
      list[0] != "111808588770635156861" &&
      list[2] != "undefined"
    ) {
      final_list.push(list);
    }
  }
}

final_list.sort(function (a, b) {
  return a[0].localeCompare(b[0]);
});
//console.log(final_list);
//console.log(final_list);
// final_list.forEach((value) => {
//   fs.appendFile(
//     "Std_act.txt",
//     `${value[0]}**${value[1]}**${value[3]}**${value[3]}**\n`,
//     (err) => {
//       if (err) return console.error(err);
//     }
//   );
// });
var file = fs.createWriteStream("std_act.txt");
file.on("error", function (err) {
  /* error handling */
});
final_list.forEach(function (v) {
  file.write(v.join("**") + "\n");
});
file.end();
