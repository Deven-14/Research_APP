const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

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
  authorize(JSON.parse(content), listCourses);
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
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function getAllData(auth, allFiles, course_id, page_Token) {
  console.log("Me too!");
  return new Promise((resolve, reject) => {
    console.log("Me 3");
    const classes = google.classroom({ version: "v1", auth });
    const params = {
      courseId: course_id,
      pageSize: 1000,
      pageToken: page_Token,
    };
    classes.courses.students.list(
      { courseId: course_id, pageSize: 1000, pageToken: page_Token },
      (err, res) => {
        if (err) return console.error("The API returned an big error: " + err);
        const students = res.data.students;
        if (students) {
          console.log("Recent activity:");
          var people_id = [];

          students.forEach((student) => {
            var name, ppl_id, email_id;
            // for (var x in activity.targets[0].driveItem) {
            //   if (x == "title") title = activity.targets[0].driveItem[x];
            //   if (x == "name") name = activity.targets[0].driveItem[x];
            //   if (x == "file") break;
            // }
            // for (x in activity.actors[0].user.knownUser)
            //   if (x == "personName")
            //     ppl_id = activity.actors[0].user.knownUser[x];
            console.log(
              student.userId,
              student.profile.emailAddress,
              student.profile.name.fullName
            );
            fs.appendFile(
              "student_email_name_id.txt",
              `${student.userId}**${student.profile.emailAddress}**${student.profile.name.fullName}\n`,
              (err) => {
                if (err) console.log(err);
              }
            );
            //people_id.
          });
        }
        if (res.data.nextPageToken) {
          getAllData(auth, allFiles, course_id, res.data.nextPageToken).then(
            (resAllFiles) => {
              resolve(resAllFiles);
            }
          );
        } else {
          resolve(allFiles);
        }
      }
    );
  });
}

function listCourses(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  data = [];
  d = getAllData(auth, data, "265849904082", "");
  d.then(function (values) {
    console.log("Happy! : )");
  });
}
