const LineReaderSync = require("line-reader-sync");

function link_student_id(email_ID, callback) {
  console.log("Student Email ID: " + email_ID);
  var lrs1 = new LineReaderSync("student_email_name_id.txt");
  while (true) {
    var line = lrs1.readline();
    if (line === null) {
      break;
    }
    var det_arr = line.split("**");
    var email_ID_file = det_arr[1].trim();
    var student_id = det_arr[0];
    var name = det_arr[2].trim();
    if (email_ID.trim() == email_ID_file) {
      console.log("Student ID: " + student_id);
      var d = callback(student_id);
      console.log("Success!");
    }
  }
}

function student_find_activities(student_ID) {
  var total_days = 0;
  var tda = [];
  var data_p_array = [];
  var complete_det = [];
  var total_days = [];
  var lrs = new LineReaderSync("std_act_2.txt");
  while (true) {
    var line = lrs.readline();
    if (line === null) {
      break;
    } else {
      if (line.includes(student_ID)) {
        var std_id_data = line.split("***");
        var std_id = std_id_data[0];
        var act_data_time = std_id_data[1].split('?');
        act_data_time.forEach(function(v){
            var activity = v.split('&');
            var activity_name = activity[0];
            var activity_dates = activity[1].split('%');
            activity_dates.forEach(function(vl){
                total_days.push(vl);
            });
            complete_det.push([activity_name, activity_dates, activity_dates.length]);
        });
        
      }
    }
    var total_unique_days = Array.from(new Set(total_days)).length;
    complete_det.unshift(total_unique_days)
    console.log(complete_det);
    return complete_det;
  }
} 
link_student_id("eng19cs0009.abhijeetkumar@gmail.com", student_find_activities);  
// module.exports = {
//   lk: link_student_id,
//   sfa: student_find_activities,
// };