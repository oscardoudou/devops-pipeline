var command = require('shelljs');
var filesystem = require('fs');
var file = '/home/vagrant/iTrust/iTrust2/src/main/resources/views/layout.html';
// Changes == with != and vice versa
function equalwithnotequalto(filedata)
{
 
   var swap = { "==": "!=" , "!=": "==" }

   var reg = new RegExp(Object.keys(swap).join("|"),"gi");

   var data = filedata.replace(reg, function(match){
   	 return swap[match];
   });
   
   return data;
   //console.log(filedata);
}

// Changes 0 with 1 and vice versa

function zerowithone(filedata)
{
   var swap = { "0": "1" , "1": "0" }

   var reg = new RegExp(Object.keys(swap).join("|"),"gi");

   var data = filedata.replace(reg, function(match){
   	 return swap[match];
   });
   
   return data;
   //console.log(filedata);
}

// Reads the file and applies the operations

// selecting a random operation from 3-4 
var operation = Math.floor(Math.random()* 2 + 3);
console.log(operation);

// if operation is 3 , its swapping == with !=
if (operation == 3)
{
   var filedata = filesystem.readFileSync(file);
   filedata = filedata.toString();

   var fuzz = equalwithnotequalto(filedata);
   filesystem.writeFileSync(file, fuzz);

   console.log("Swapped == with != in file and otherwise in" + file);
}
// if operation is 4 , its swapping 0 with 1
else if (operation == 4)
{
   
   var filedata = filesystem.readFileSync(file);
   filedata = filedata.toString();

   var fuzz = zerowithone(filedata);
   filesystem.writeFileSync(file, fuzz);

   console.log("Swapped 0 with 1 in file and otherwise in" + file);
}

// check if fuzzing is successful by compiling iTrust
command.exec('cd /home/vagrant/iTrust/iTrust2');
command.exec('sudo mvn compile');