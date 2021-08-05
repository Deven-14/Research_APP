//creates a folder for each class
 
const fs = require('fs')
const lineReaderSync = require('line-reader-sync')


function make_directories()
{
    var lrs = new lineReaderSync("../data_files/classroom_details.txt");
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
        fs.mkdir(`../data_files/${name}`, (err)=> {
            if(err)
                console.log(err)
            console.log(`Created File ${name}`)
        })
    }
}

make_directories();
