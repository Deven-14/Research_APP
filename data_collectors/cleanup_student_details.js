//This files reads through the student details and sorts it up the required
const LineReaderSync = require("line-reader-sync");
const fs = require("fs");

function clean_it(course_section) {
  var final_list = [];
  var list_line_by_line = [];
  lrs = new LineReaderSync(
    `../data_files/section_${course_section}/student_activity_details.txt`
  );
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

  var lrs2 = new LineReaderSync(
    `../data_files/section_${course_section}/student_email_name_id.txt`
  );
  while (true) {
    var line2 = lrs2.readline();
    if (line2 === null) {
      break;
    } else {
      var student_id = line2.split("**")[0];
      console.log(student_id);
      var strarr = [];
      var doc_name_arr = new Set();
      final_list.forEach(function (v) {
        if (student_id == v[0]) {
          doc_name_arr.add(v[3].trim());
          strarr.push([v[3].trim(), v[1]]);
        }
      });

      var arr = Array.from(doc_name_arr);
      var unique_act = [];
      for (var i = 0; i < arr.length; i++) {
        var per_doc_name = arr[i];
        var dates = [];
        strarr.forEach(function (j) {
          if (per_doc_name == j[0]) {
            var just_date = j[1].split("T")[0];
            dates.push(just_date);
          }
        });
        dates = Array.from(new Set(dates));
        //console.log(dates);
        unique_act.push([per_doc_name, dates.join("%")].join("&"));
      }
    }
    list_line_by_line.push([student_id, unique_act.join("?")].join("***"));
  }
  // `../data_files/section_${course_section}/final_student_activities.txt`

  var file = fs.createWriteStream("testing.txt");
  file.on("error", function (err) {
    console.log(err);
  });
  list_line_by_line.forEach(function (v) {
    file.write(v + "\n");
    console.log(v);
  });
  file.end();
}
function run() {
  var lrs_main = new LineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    //var data = [];
    var line = lrs_main.readline();
    if (line == null) break;
    var values = line.split(", ");
    console.log("values");
    var d = clean_it(values[1]);
    break;
  }
}
run();
