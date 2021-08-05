const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");
const get_auth = require("./0_get_auth");


function getCourseWork(classroom, name, course_id, page_Token) { 

  return new Promise((resolve, reject) => {
    classroom.courses.courseWork.list(
      {
        courseId: course_id,
        pageSize: 1000,
        pageToken: page_Token,
      },
      async (err, res) => {

        if (err) {
            console.error("The API returned an error: " + err);
        }

        const courseWork = res.data.courseWork;
        if (courseWork && courseWork.length) {

          courseWork.forEach((activity) => {
        
            if(activity.assignment != undefined && activity.assignment.studentWorkFolder != undefined){
              //console.log(activity.assignment.studentWorkFolder)
            
              var allFiles = [activity.assignment.studentWorkFolder.title.trim(), activity.assignment.studentWorkFolder.id.trim()].join('**')+"\n";
              console.log(allFiles)
              
              fs.writeFileSync( 
                `../data_files/${name}/Activities.txt`,
                allFiles,
                {encoding:'utf8',flag:'a'},
                (err1) => {
                  if (err1) console.log(err);
                }
              );
            }
              
          });
        }
        // resolve(res.data.nextPageToken);
        if(res.data.nextPageToken)
        {
          console.log("Getting activity details...");
          await getCourseWork(classroom, name, course_id, res.data.nextPageToken);
          resolve("done with next page token");
        } else {
          resolve(`done with course ${name}`);
        }

      });
    });

}


function getCourseWorkForAllClasses(auth) {

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
      await getCourseWork(classroom, name, courseId, "");
      console.log(`done with course ${name}`);
      
    }

  });

}


async function main()
{
  const auth = await get_auth();
  await getCourseWorkForAllClasses(auth);
}

main();