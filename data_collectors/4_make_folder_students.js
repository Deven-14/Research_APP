const fs = require('fs')
const lineReaderSync = require('line-reader-sync')


function make_directories()
{
    var lrs = new lineReaderSync("../data_files/classroom_details.csv")
    while(true)
    {
        var line = lrs.readline();
        if(line === null)
        {
            break;
        }
        var list = line.split(",")
        let name = list[0]
        if(list[1] !== "null")
            name += "_"+list[1]
        var lrs2 = new lineReaderSync(`../data_files/${name}/student_details.csv`)
        while(true)
        {
            var student = lrs2.readline()
            if(student === null){
                break
            }
            let s_name = student.split(",")
            s_name = s_name[0]
            fs.mkdir(`../data_files/${name}/${s_name}`, (err)=> {
                if(err)
                    console.log(err)
                console.log(`Created File ${s_name}`)
            })
        }
    }
}

make_directories()
