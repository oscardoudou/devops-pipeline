var command = require('shelljs');
var filesystem = require('fs');
// var file = '/home/vagrant/iTrust/iTrust2/src/main/resources/views/layout.html';
// Changes == with != and vice versa
function equalWithNotEqualTo(data) {
 
   var swap = { "==": "!=" , "!=": "==" }

   var reg = new RegExp(Object.keys(swap).join("|"),"gi");

   var data = data.replace(reg, function(match){
   	 return swap[match];
   });
   
   return data;
   //console.log(data);
}

// Changes 0 with 1 and vice versa

function zeroWithOne(data) {
   var swap = { "0": "1" , "1": "0" }

   var reg = new RegExp(Object.keys(swap).join("|"),"gi");

   var data = data.replace(reg, function(match){
   	 return swap[match];
   });
   
   return data;
   //console.log(data);
}

// change content of "strings" in code

function changeStringContent(data) {
    // var randomString 
}

// swap "<" with ">"

function changeGreaterAndLesserThan(data) {
    var swap = { ">": "<" , "<": ">" }

    var reg = new RegExp(Object.keys(swap).join("|"),"gi");
 
    var data = data.replace(reg, function(match){
         return swap[match];
    });
    
    return data; 
}


// select files for fuzzing

function selectFiles() {
    var path = '/home/vagrant/iTrust/iTrust2/src/main/java/edu/ncsu/csc/itrust2/';
    var selectedFiles = []
    var directories = ['utils', 'config', 'mvc/config', 'models/persistent', 'models/enums', 'controllers/api']

    directories.forEach(function(directory) {
        let fullPath = `${path}${directory}`
        console.log(fullPath)

        var files = fs.readdirSync(fullPath);

        files.forEach(function(file) {
            if(path.extname(file) == '.java') {
                selectedFiles.push(file)
            }
        })
    })

    return selectedFiles
}

var listOfFiles = selectFiles()

// Reads the file and applies the operations
listOfFiles.forEach(function(file) {
    // selecting a random operation from 1-4 
    var fuzzingOperation = Math.floor(Math.random()* 2 + 3);
    console.log(fuzzingOperation);

    // if operation is 3 , its swapping == with !=
    if (fuzzingOperation == 3)
    {
    var filedata = filesystem.readFileSync(file);
    filedata = filedata.toString();

    var fuzz = equalWithNotEqualTo(filedata);
    filesystem.writeFileSync(file, fuzz);

    console.log("Swapped == with != in file and otherwise in" + file);
    }
    // if operation is 4 , its swapping 0 with 1
    else if (fuzzingOperation == 4)
    {
    
    var filedata = filesystem.readFileSync(file);
    filedata = filedata.toString();

    var fuzz = zeroWithOne(filedata);
    filesystem.writeFileSync(file, fuzz);

    console.log("Swapped 0 with 1 in file and otherwise in" + file);
    }
})


// check if fuzzing is successful by compiling iTrust
command.exec('cd /home/vagrant/iTrust/iTrust2');
command.exec('sudo mvn compile');