const LineReaderSync = require("line-reader-sync")
var final_list = [];
var lrs=new LineReaderSync("student_details.txt");
while(true){
    var line = lrs.readline();
    if(line === null){
        break;
    }
    else{
    var list = line.split("**");
    if(list[3] != 'people/102641484502798472042' && list[3] != 'people/111808588770635156861'){
        final_list.push(list);
    }
    }
}
console.log(final_list);
 