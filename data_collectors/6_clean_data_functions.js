const lineReaderSync = require('line-reader-sync')
const fs = require('fs');


function getItCleaned(name)
{
    return new Promise((resolve, reject) => {

        var total_data = {}
        if(!fs.existsSync(`../data_files/${name}/student_activity_details.txt`))
            resolve(undefined);

        var lrs = new lineReaderSync(`../data_files/${name}/student_activity_details.txt`)
        var line;
        while((line = lrs.readline()) != null)
        {
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

        resolve(total_data);
    });
  // console.log(total_data)
  // var activities = getActivities(name)
  //writeToFile(total_data, name)
    //return total_data
}

function getActivities(name)
{
    return new Promise((resolve, reject) => {

        var lrs = new lineReaderSync(`../data_files/${name}/Activities.txt`)
        var acts = []
        var line;
        while((line = lrs.readline()) != null)
        {
            list = line.split("**")
            acts.push(list[0])
        }
        resolve(acts);
    });
  // acts.unshift("Student/Activity")
  //return acts
  // console.log(acts)
}

function getHashStudents(name){

    return new Promise((resolve, reject) => {
        let students = {}
        var lrs = new lineReaderSync(`../data_files/${name}/class_details.txt`)
        var line;
        while((line = lrs.readline()) != null)
        {
            list = line.split("**")
            students[list[0]] = list[2].trim()    
        }
        resolve(students);
    });
  // console.log(students)
  //return students;
}

module.exports = {
    getItCleaned: getItCleaned,
    getActivities: getActivities,
    getHashStudents: getHashStudents
}