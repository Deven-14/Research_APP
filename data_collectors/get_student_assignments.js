const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync")
const SCOPES = ["https://www.googleapis.com/auth/drive.activity.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me",]
// const SCOPES = [ "https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly",];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), getCourses);
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
        if (err2) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function getHashStudents(name){
    let students = {}
    var lrs = new lineReaderSync(`../data_files/${name}/class_details.txt`)
    while(true)
    {
        let line = lrs.readline()
        if(line === null)
        {
            break
        }
        list = line.split("**")
        students[list[0]] = list[2]    
    }
    return students;
}


async function getCourseWorkIds(name){
    let activities = {}
    let act_id = []
   
    var lrs = new lineReaderSync(`../data_files/${name}/Activities.csv`)
    while(true)
    {
        let line = lrs.readline()
        if(line === null)
        {
            break
        }
        list = line.split("^,^")
        act_id.push(list[1])
        activities[list[0]] = list[1]
    }
    // console.log(activities, act_id)
    return {activities, act_id};
  
}




async function getCourseWork(classroom, list) {

    var nextPage = "";
    let name = list[0]
    if(list[1] !== "null")
      name += "_"+list[1]
    var students =await getHashStudents(name)
    var stuff = await getCourseWorkIds(name)
    var courseNames = stuff.activities
    var courseWorkIds = stuff.act_id
    // console.log(courseWorkIds, courseNames)
    courseWorkIds.map(async (act) => {
        do{
            var getAPagePromise = new Promise((resolve2, reject2) => {
                classroom.courses.courseWork.studentSubmissions.list(
                    {
                        courseId: list[2],
                        courseWorkId: act,
                        pageSize: 1000,
                        pageToken: nextPage,
                    },(err, res) => {
                        if (err) {
                            console.error("The API returned an error: " + err);
                        }
                        const studentSubmissions = res.data.studentSubmissions;
                    if (studentSubmissions && studentSubmissions.length) {
                        studentSubmissions.forEach((submission) => {
                            var check_file = submission.assignmentSubmission.attachments
                            if(check_file !== undefined)
                            {
                                var check_driveFile = check_file[0].driveFile
                                if(check_driveFile !== undefined)
                                {
                                    var file = check_driveFile
                                    var userId = submission.userId
                                    let data = [courseNames[act] , file.title, file.id, file.alternateLink].join("^,^")+"\n"
                                    console.log(data, students[userId])
                                    fs.appendFileSync(
                                        `../data_files/${name}/Submissions.csv`,
                                        data,
                                        {encoding:'utf8',flag:'a'},
                                        (err1) => {
                                            if (err1) console.log(err);
                                        }
                                    );
                                }
                            }
                        });
                    }
                    resolve2(res.data.nextPageToken);
                    })
              });
        
              nextPage = await getAPagePromise;
              
          }while(nextPage);
        
    })


}


function getCourses(auth) {
  // return Promise.resolve("Get Courses Successful!")

  //fs.unlink("../data_files/classroom_details.txt", (err1) => { if (err1) throw err; });
  const classroom = google.classroom({ version: "v1", auth });


  var lrs = new lineReaderSync("../data_files/classroom_details.txt")
  while(true)
  {
    let line = lrs.readline()
    if(line === null)
    {
        break
    }
    let list = line.split(",")
    if(fs.existsSync(`../data_files/${list[0]}/class_details.txt`))
      getCourseWork(classroom, list)
  }
}
