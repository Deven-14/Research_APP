//This file traverses through all the required course ids, fetches the required student details in each section and puts the data in respective folders
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const LineReaderSync = require("line-reader-sync");
const lineReaderSync = require("line-reader-sync");

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), list_students_in_course);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
        if (err2) return console.error(err2);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function getAllData(auth, allFiles, name, course_id, page_Token) {
  console.log("Me too!");
  return new Promise((resolve, reject) => {
    console.log("Me 3");
    const classes = google.classroom({ version: "v1", auth });
    classes.courses.students.list(
      { courseId: course_id, pageSize: 1000, pageToken: page_Token },
      (err, res) => {
        if (err) return console.error("The API returned an error: " + err);
        const students = res.data.students;
        if (students) {
          console.log("Recent activity:");
          students.forEach((student) => {
            console.log(
              student.userId,
              student.profile.emailAddress,
              student.profile.name.fullName
            );
              var dir = `../data_files/${name}`
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
          getAllData(
            auth,
            allFiles,
            name,
            course_id,
            res.data.nextPageToken
          ).then((resAllFiles) => {
            resolve(resAllFiles);
          });
        } else {
          resolve(allFiles);
        }
      }
    );
  });
}

function list_students_in_course(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  var lrs = new lineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    var data = [];
    var line = lrs.readline();
    if (line == null) 
    break;
    else{
    var list = line.split(",");
    let name = list[0]
        if(list[1] !== "null")
            name += "_"+list[1]
    var d = getAllData(auth, data, name, list[2], "");
    d.then(function () {
      console.log("Happy! : )");
    });
  }
}
}

