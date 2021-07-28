const lineReaderSync = require('line-reader-sync')
const fs = require('fs')

function getItCleaned(course, name)
{
  var total_data = {}
  if(!fs.existsSync(`../data_files/${name}/student_activity_details.txt`))
    return 
  var lrs = new lineReaderSync(`../data_files/${name}/student_activity_details.txt`)
  while(true)
  {
      let line = lrs.readline()
      if(line === null)
        break
      line = line.split("**")
      if(total_data[line[0].trim()] !== undefined && total_data[line[0].trim()][line[3].trim()] !== undefined)
      {
        // console.log(1)
        total_data[line[0]][line[3].trim()].push(line[1])
      }
      else
      {
        if(total_data[line[0]] === undefined)
        {
          total_data[line[0]] = {}
          total_data[line[0]][line[3].trim()] = [line[1]]
        }
        else
        {
          total_data[line[0]][line[3].trim()] = [line[1]]
        }
      }
  }
  // console.log(total_data)
  // var activities = getActivities(name)
  writeToFile(total_data, name)
  // return total_data
}

function getActivities(name)
{
  var lrs = new lineReaderSync(`../data_files/${name}/Activities.txt`)
  var acts = []
  while(true)
  {
    var line = lrs.readline()
    if(line === null)
      break
    list = line.split("**")
    acts.push(list[0])
  }
  // acts.unshift("Student/Activity")
  return acts
  // console.log(acts)
}

function getHashStudents(name){
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
      students[list[0]] = list[2].trim()    
  }
  // console.log(students)
  return students;
}

function writeToFile(data, name)
{
  var students =getHashStudents(name)
  // console.log(students)
  var activities = getActivities(name)
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
  })
}




var lrs = new lineReaderSync("../data_files/classroom_details.txt")
  while(true)
  {
    let line = lrs.readline()
    if(line === null)
    {
        break
    }
    let list = line.split(",")
    let name = list[0]
    if(list[1] !== "null")
      name += "_"+list[1]
    if(fs.existsSync(`../data_files/${name}/class_details.txt`))
      getItCleaned(list, name)
  }