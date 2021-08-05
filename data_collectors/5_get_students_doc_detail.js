//Given the classroom drive ids and classroom sections this file adds all the activites perfomed in that drive into respective folders
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");
//var sleep = require("system-sleep");
const get_auth = require("./0_get_auth");


function getAllData(drive, sname, ancestor_name, acname, page_Token) {
  
  return new Promise((resolve, reject) => {

    const params = {
      pageSize: 1000,
      ancestorName: `items/${ancestor_name.trim()}`,
      pageToken: page_Token,
      filter: "time < \"2021-08-01T00:00:00Z\" detail.action_detail_case:(EDIT)",
    }
    
    drive.activity.query({ requestBody: params }, async (err, res) => {
      
      if (err) return console.error("The API returned an big error: " + err);
      const activities = res.data.activities;
      
      if (activities) {
        
        console.log("Getting activity details...");
        activities.forEach((activity) => {
          var name, title, ppl_id;

          for (var x in activity.targets[0].driveItem) {
            if (x == "title") title = activity.targets[0].driveItem[x];
            if (x == "name") name = activity.targets[0].driveItem[x];
            if (x == "file") break;
          }
          
          for (x in activity.actors[0].user.knownUser){

            if (x == "personName"){

              ppl_id = activity.actors[0].user.knownUser[x];
              //console.log(ppl_id.slice(7)) 
              var allFiles = `${ppl_id.slice(7)}**${activity.timestamp}**${name.trim()}**${acname}\n`;
              console.log(allFiles)

              fs.appendFileSync(
                `../data_files/${sname.trim()}/student_activity_details.txt`,
                allFiles,
                (err) => {
                  if (err) console.log(err);
                }
              );
            }

          }
          
        });
      }

      // if (res.data.nextPageToken) {
      //   getAllData(
      //     auth,
      //     course_section,
      //     ancestor_name,
      //     res.data.nextPageToken
      //   ).then((resAllFiles) => {
      //     resolve(resAllFiles);
      //   });
      // } else {
      //   resolve(allFiles);
      // }

      if (res.data.nextPageToken) {
        await getAllData(drive, sname, ancestor_name, acname, res.data.nextPageToken);
        resolve("done with next page token");
      } else {
        resolve(`done with course ${sname}`);
      }
    
    });
  });
}

function listDriveActivity(auth) {
  
  return new Promise(async (resolve, reject) => {

    var lrs = new lineReaderSync("../data_files/classroom_details.txt");
    const drive = google.driveactivity({ version: "v2", auth });
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

    while ((line = lrs.readline()) != null) {

      var list = line.split(",");
      let name = list[0];
      if(list[1] !== "null")
          name += "_"+list[1];
      
      if(fs.existsSync(`../data_files/${name}/Activities.txt`)){

        var lrs2 = new lineReaderSync(`../data_files/${name}/Activities.txt`);
        var line1;

        while ((line1 = lrs2.readline()) != null) {
          list1 = line1.split("**")
          await getAllData(drive, name, list1[1], list1[0], "");
          console.log(`done with course ${name}`);
          await sleep(500);
          console.log("here");
        }

      }
      //sleep(900);
    }

  });
}


async function main()
{
  const auth = await get_auth();
  await listDriveActivity(auth);
}

main();