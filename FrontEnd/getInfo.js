const lineReaderSync = require("line-reader-sync");

function GetInfo(name, callback_function)
{
    var sections = ["A", "B", "C", "D", "E", "F", "G", "Master"];
    //var sections = ["test"];
    var details = [];
    var file_names = [];
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
                    file_names.push(studentDetail[1]);
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
    callback_function(file_names, details);
    //return worked_dates;
}

function get_data(file_names, details){
    var unique_file_names = Array.from(new Set(file_names));
    for(var i = 0; i < unique_file_names.length; i++){
        var worked_dates = [];
        var sum_of_edits = 0;
        worked_dates.push(unique_file_names[i]);
        details.forEach(function(entry){
            //console.log(entry[1]);
            if(entry[0]==unique_file_names[i]){
                worked_dates.push(entry[1]);
                sum_of_edits = sum_of_edits + parseInt(entry[2]);
            }

        });
        worked_dates.unshift((worked_dates.length - 1));
        worked_dates.push(sum_of_edits);
        return worked_dates;
    }
}

//GetInfo("Sumedh D Karanth", get_data);
module.exports = {GetInfo, get_data};