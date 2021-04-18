const LineReaderSync = require("line-reader-sync");

function link_student_id(in_section, student_id, callback, superman, writer) {
  // console.log("Student Email ID: " + email_ID);
  // var lrs1 = new LineReaderSync("student_email_name_id.txt");
  // while (true) {
  //   var line = lrs1.readline();
  //   if (line === null) {
  //     break;
  //   }
  //   var det_arr = line.split("**");
  //   var email_ID_file = det_arr[1].trim();
  //   var student_id = det_arr[0];
  //   var name = det_arr[2].trim();
  //if (email_ID.trim() == email_ID_file) {
  console.log("Student ID: " + student_id);
  var d = Array.from(callback(student_id, in_section, superman));
  console.log("Success!");
}

function compute_days_worked(data, total_days) {
  var complete_det = [];
  var act_data_time = data.split("?");
  act_data_time.forEach(function (v) {
    var activity = v.split("&");
    var activity_name = activity[0];
    var activity_dates = activity[1].split("%");
    //console.log(activity_dates);
    activity_dates.forEach(function (vl) {
      total_days.push(vl);
    });
    complete_det.push(activity_name, activity_dates, activity_dates.length);
  });
  return complete_det;
}

function student_find_activities(student_ID, section, batman) {
  var computed_data = [];
  var total_days = [];
  var lrs = new LineReaderSync(
    `../data_files/section_${section}/final_student_activities.txt`
  );
  while (true) {
    var line = lrs.readline();
    if (line === null) {
      break;
    } else {
      if (line.includes(student_ID)) {
        var std_id_data = line.split("***");
        var std_id = std_id_data[0];
        console.log(std_id);
        computed_data.push(batman(std_id_data[1], total_days));
      }
    }
  }
  var total_unique_days = Array.from(new Set(total_days)).length;
  console.log("Total unique days: ", total_unique_days);
  computed_data[0].unshift(total_unique_days);
  console.log(computed_data);
  return computed_data[0];
}

function search(email) {
  var sections = new LineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    var line = sections.readline();
    if (line == null) return;
    else {
      var values = line.split(", ");
      var in_section = new LineReaderSync(
        `../data_files/section_${values[1]}/student_email_name_id.txt`
      );
      while (true) {
        var line_in_file = in_section.readline();
        if (line_in_file == null) break;
        var data = line_in_file.split("**");
        if (data[1] == email)
          link_student_id(
            values[1],
            data[0],
            student_find_activities,
            compute_days_worked
          );
      }
    }
  }
}
console.log("Here!");
search("adhinarayanan619@gmail.com");
