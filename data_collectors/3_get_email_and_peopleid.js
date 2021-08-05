//This file traverses through all the required course ids, fetches the required student details in each section and puts the data in respective folders
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");
const get_auth = require("./0_get_auth")


function getAllData(classroom, name, course_id, page_Token) {

  return new Promise((resolve, reject) => {

    classroom.courses.students.list(
      { courseId: course_id, pageSize: 1000, pageToken: page_Token },
      async (err, res) => {

        if (err) return console.error("The API returned an error: " + err);

        const students = res.data.students;
        if (students) {

          console.log("Getting student details...");
          students.forEach((student) => {

            //console.log(student.userId, student.profile.emailAddress, student.profile.name.fullName);

            fs.appendFile(
              `../data_files/${name}/class_details.txt`,
              `${student.userId}**${student.profile.emailAddress}**${student.profile.name.fullName}\n`,
              (err1) => {
                if (err1) console.log(err1);
              }
            );
          
          });

        }

        if (res.data.nextPageToken) {
          await getAllData(classroom, name, course_id, res.data.nextPageToken);
          resolve("done with next page token");
        } else {
          resolve(`done with course ${name}`);
        }

      }
    );
    
  });

}

function list_students_in_course(auth) {

  return new Promise(async (resolve, reject) => {

    const classroom = google.classroom({ version: "v1", auth });
    var lrs = new lineReaderSync("../data_files/classroom_details.txt");
    var line;

    while ((line = lrs.readline()) != null) {

      var list = line.split(",");
      let name = list[0]
      var courseId = list[2]
      if(list[1] !== "null")
          name += "_"+list[1] 
      await getAllData(classroom, name, courseId, "");
      console.log(`done with course ${name}`);
      
    }

  });
}

async function main()
{
  const auth = await get_auth();
  await list_students_in_course(auth);
}

main();