//Given the classroom drive ids and classroom sections this file adds all the activites perfomed in that drive into respective folders
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");

const SCOPES = [  "https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/drive.activity https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/drive.activity.readonly https://www.googleapis.com/auth/classroom.rosters.readonly",
];
const TOKEN_PATH = "token.json";

fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), listDriveActivity);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function getAllData(auth, allFiles, sname, course_section, ancestor_name, page_Token) {
  console.log("Me too!");
  return new Promise((resolve, reject) => {
      console.log("Me 3");
      const drive = google.driveactivity({ version: "v2", auth });
      const params = {
        pageSize: 1000,
        ancestorName: `items/${ancestor_name.trim()}`,
        pageToken: page_Token,
        filter: "detail.action_detail_case:(EDIT)",
        }
      //console.log("Me 4")
      drive.activity.query({ requestBody: params }, (err, res) => {
        if (err) return console.error("The API returned an big error: " + err);
        const activities = res.data.activities;
        //console.log("Me 5");
        if (activities) {
          //console.log("Me 7")
          console.log("Recent activity:");
          activities.forEach((activity) => {
            var name, title, ppl_id;
            for (var x in activity.targets[0].driveItem) {
              if (x == "title") title = activity.targets[0].driveItem[x];
              if (x == "name") name = activity.targets[0].driveItem[x];
              if (x == "file") break;
            }
            //console.log("Me 6");
            if(title.includes("test2")){
              for (x in activity.actors[0].user.knownUser){
                if (x == "personName"){
                  ppl_id = activity.actors[0].user.knownUser[x];
                  //console.log(ppl_id.slice(7))
                  allFiles = `${ppl_id.slice(7)}**${activity.timestamp}**${name}**${title}\n`;
                  //console.log(allFiles)
                fs.appendFile(
                `../data_files/${sname.trim()}_${course_section.trim()}/student_activity_details.txt`,
                allFiles,
                (err) => {
                  if (err) console.log(err);
                }
              );
                }
              }
            }
          });
        }
        if (res.data.nextPageToken) {
          getAllData(
            auth,
            allFiles,
            course_section,
            ancestor_name,
            res.data.nextPageToken
          ).then((resAllFiles) => {
            resolve(resAllFiles);
          });
        } else {
          resolve(allFiles);
        }
      });
  });
}

function listDriveActivity(auth) {
  console.log("Me love mangoes");
  var lrs = new lineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    var data = [];
    var line = lrs.readline();
    if (line == null) break;
    var values = line.split(",");

    var d = getAllData(auth, data, values[0], values[1], values[3], "");
    //console.log(d)
    d.then(function () {
      console.log("Happy! : )");
    });
  }
}
