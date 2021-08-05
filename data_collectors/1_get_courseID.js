//This file gets the course names, sections, course ids, classroom drive ids of the required courses

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const get_auth = require('./0_get_auth');


function listCourses(auth) {

  return new Promise((resolve, reject) => {
    
    const classroom = google.classroom({ version: "v1", auth });
    var allFiles = []
    var data = []

    classroom.courses.list(
      {
        pageSize: 1000,
      },
      (err, res) => {

        if (err) 
          return console.error("The API returned an error: " + err);

        const courses = res.data.courses;

        if (courses && courses.length) {

          //console.log("Courses:");
          courses.forEach((course) => {

            if(course.creationTime.slice(0, 4) === "2021") {

              data.push({ name : course.name,  id : course.id, teacherId : course.teacherFolder.id });
              var section = (course.section) ? course.section : "null";
              //console.log(section);

              allFiles = [course.name, section, course.id, course.teacherFolder.id].join(',');

              fs.appendFile(
                "../data_files/classroom_details.txt", `${allFiles}\n`,
                (err) => {
                  if (err) throw err;
                }
              );
              //console.log(`${course.name} ${section} (${course.id})`);

            }
            
          });

          console.log("All Courses found, Classroom_details.txt created");
          resolve("All Courses found");
        } else {
          resolve("No courses found.");
        }

      } 

    );

  });

}

async function main()
{
  const auth = await get_auth();
  await listCourses(auth);
}

main();