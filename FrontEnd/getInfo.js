const lineReaderSync = require("line-reader-sync");

function GetInfo(name)
{
    var sections = ["A", "B", "C", "D", "E", "F", "G", "Master"];
    var details = [];
    sections.every(function(section) {
        var lrs = new lineReaderSync(`./data/section_data_with_link - section_${section}_csv_data.csv`);
        while(true)
        {
            var line = lrs.readline();
            if(line == null)
                break;
            else
            {
                var studentDetail = line.split(",");
                if(name == studentDetail[0])
                {
                    details.push([studentDetail[1], studentDetail[2], studentDetail[3]]);
                }
                else if(details.length != 0)
                    break;
            }
        }
        if(details.length != 0)
            return false;
        return true;
    });
    //console.log(details);
    return details;
}

//getInfo("S.Rohith Royal");
module.exports = {GetInfo};