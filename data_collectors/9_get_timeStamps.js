const lineReaderSync = require('line-reader-sync')
const fs = require('fs')
const clean_data_functions = require("./6_clean_data_functions");
const getItCleaned = clean_data_functions.getItCleaned;
const getActivities = clean_data_functions.getActivities;
const getHashStudents = clean_data_functions.getHashStudents;

function writeToFile(data, name)
{
  return new Promise(async (resolve, reject) => {

    var students = await getHashStudents(name)
    var activities = await getActivities(name)
    var total = ""
    for (const [pplId, files] of Object.entries(data)){
      if(students[pplId]!== undefined)
      {
          activities.forEach((activity) => {
            if(files[activity] !== undefined)
            {
              total += `${students[pplId]}**${activity}**${files[activity].join("**")}\n`
            }
        })
      }
    }
    console.log(total)
    fs.writeFileSync(
      `../data_files/${name}/timestamps.csv`,
      total,
      {encoding:'utf8',flag:'a'},
      (err1) => {
          if (err1) console.log(err);
    });

    resolve(`Done with ${name}`);
  });
}


function get_time_stamps()
{
  return new Promise(async (resolve, reject) => {
    var lrs = new lineReaderSync("../data_files/classroom_details.txt")
    var line;

    while ((line = lrs.readline()) != null)
    {
      let list = line.split(",");
      let name = list[0];
      if(list[1] != "null")
        name += "_"+list[1]
      if(fs.existsSync(`../data_files/${name}/class_details.txt`))
      {
        total_data = await getItCleaned(name);
        if(total_data != undefined)
          await writeToFile(total_data, name);
      }
    }
    console.log("completed");
    resolve("Completed");
  });
}

async function main()
{
  await get_time_stamps();
}

main();