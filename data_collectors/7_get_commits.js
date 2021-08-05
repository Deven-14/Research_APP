const lineReaderSync = require('line-reader-sync');
const fs = require('fs');
const clean_data_functions = require("./6_clean_data_functions");
const getItCleaned = clean_data_functions.getItCleaned;
const getActivities = clean_data_functions.getActivities;
const getHashStudents = clean_data_functions.getHashStudents;


function writeToFile(data, name)
{
  return new Promise(async (resolve, reject) => {

    var students = await getHashStudents(name)
    // console.log(students)
    var activities = await getActivities(name)
    var total = "Students/Activites**"+activities.join("**")+"\n"

    for (const [pplId, files] of Object.entries(data)){
      // console.log(pplId, files)
      // console.log(students[pplId], pplId, name)
      if(students[pplId]!== undefined)
      {
        line = `${students[pplId]}**`
        // console.log(line)
        activities.forEach((activity) => {
          if(files[activity] !== undefined)
            line += `${files[activity].length}**`
          else
            line += "0**"
        })
        total += line + "\n"
      }
    }

    console.log(total)
    fs.writeFileSync(
      `../data_files/${name}/commits.csv`,
      total,
      {encoding:'utf8',flag:'a'},
      (err1) => {
          if (err1) console.log(err);
    });
    resolve(`Done with ${name}`);
  });
}


function get_commits()
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
  await get_commits();
}

main();