//This files reads through the student details and sorts it up the required
const LineReaderSync = require("line-reader-sync");
const fs = require("fs");
//const path = require("path/posix");

function clean_it(course_name) {
  var final_list = [];
  var list_line_by_line = [];
  path = `../data_files/${course_name}/student_activity_details.txt`
  if(fs.existsSync(path)){
    console.log(course_name);
    var lrs = new LineReaderSync(path);
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

    var lrs2 = new LineReaderSync(
      `../data_files/${course_name}/class_details.txt`
    );
    while (true) {
      var line2 = lrs2.readline();
      if (line2 === null) {
        break;
      } else {
        var std_det = line2.split("**"); 
        var student_id = std_det[0];
        var name = std_det[2];
        var email = std_det[1];
        //console.log(student_id);
        var time_stamps = [];
        var non_unique_dates = [];
        var dates = [];
        var final_count = [];
        var total_days = 0;
        for (var i = 0; i < final_list.length; i++) {  
          if(student_id == final_list[i][0]){      
          var just_date = final_list[i][1].split("T")[0];
          non_unique_dates.push(just_date);
          time_stamps.push(final_list[i][1]);
          dates = Array.from(new Set(non_unique_dates));
          total_days = dates.length;
          //console.log(dates);
          }
        }
        //console.log(time_stamps);
          dates.forEach(function (j) {
            var c = 0;
              for(var k=0; k<time_stamps.length; k++){
                var particular_dates = time_stamps[k].split("T")
                if(j == particular_dates[0]){
                    c = c+1;
                } 
                //console.log(c);
              }
              final_count.push([j, String(c)].join(" : "));
          });
          //console.log(dates);
          //date_time_count = final_count;
          

        }
        list_line_by_line.push([name.trim(), email.trim(), final_count.join(", "), String(total_days)].join(", "));
          
  }
}

  console.log(list_line_by_line);
        
          // var file = fs.createWriteStream(`../data_files/${course_name}/final_student_data.csv`
          //   );
          //   file.on("error", function (err) {
          //     console.log(err);
          //   });
          //   list_line_by_line.forEach(function (v) {
          //     file.write(v +"\n");
          //     //console.log(v);
          //   });
          //   file.end();

     
  }
    
 // `../data_files/section_${course_section}/final_student_activities.txt`

function run() {
  var lrs_main = new LineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    //var data = [];
    var line = lrs_main.readline();
    if (line == null) break;
    var list = line.split(",");
    let name = list[0]
    if(list[1] !== "null")
        name += "_"+list[1]
    clean_it(name); 
  }
}
run();
