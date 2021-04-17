const LineReaderSync = require("line-reader-sync");
const fs = require("fs");
var final_list = [];
var lrs = new LineReaderSync("student_details.txt");
var list_line_by_line = [];

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


var lrs2 = new LineReaderSync("student_email_name_id.txt");
while (true) { 
  var line2 = lrs2.readline();
  if (line2 === null) {
    break;
  } else {
      var student_id = line2.split("**")[0];
      console.log(student_id);
      var strarr = [];
      var doc_name_arr = new Set();
      final_list.forEach(function(v){
          if(student_id == v[0]){
            doc_name_arr.add(v[3].trim());
            strarr.push([v[3].trim(), v[1]]);
          }
      });
      
      var arr = Array.from(doc_name_arr);
      var unique_act = [];
      for(var i =0; i<arr.length; i++){
        var per_doc_name = arr[i];
        var dates = [];
        strarr.forEach(function(j){
          if(per_doc_name == j[0]){
            var just_date = j[1].split('T')[0];
            dates.push(just_date);
          }
        });
        dates = Array.from(new Set(dates));
        console.log(dates);
        unique_act.push([per_doc_name , (dates.join('%'))].join('&')); 
      }
      }
      list_line_by_line.push([student_id, unique_act.join('?')].join('***'));

  }
  




var file = fs.createWriteStream("std_act_2.txt");
  file.on("error", function (err) {
    /* error handling */
  });
  list_line_by_line.forEach(function (v) {
    file.write(v+"\n");
  });
  file.end();
  




// var file = fs.createWriteStream("std_act.txt");
// file.on("error", function (err) {
//   /* error handling */
// });
// final_list.forEach(function (v) {
//   file.write(v.join("**") + "\n");
// });
// file.end();
