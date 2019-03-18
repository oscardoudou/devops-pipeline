var fs = require('fs');
// var Bluebird = require('bluebird')
//should be 100, assume now is 2, need retrieve this value from playbook
var repeat = 2;
var tests = [];

if( process.env.NODE_ENV != "test")
{
    firstTask('Generating Prioritization Summary across xml\n================================================================================',priorSum);
}
    
function firstTask(subject, secondTask){
    console.log(subject);
    fs.readdir("/home/vagrant/prior/testReport", (err, files) => { 
        files.forEach((file,i) => { 
            if (file.substr(file.length - 5) === '.json') { 
                    combineSeperate(file);
                    if(i == files.length-1){
                        secondTask();
                    }
                        
            } 
        }); 
    });
}

function priorSum(){
    tests.sort(function(a,b){
        if(a.fail < b.fail)
            return -1;
        if(a.fail > b.fail)
            return 1;
        if(a.fail == b.fail)
            return a.time - b.time;
    })
    for(var i = 0 ;i < tests.length; i++){
        console.log(tests[i]);
    }
    console.log("\nreport end");
    console.log("================================================================================");
}

function combineSeperate(file){
    var filename = file.substr();
    try{
        var fileContent = fs.readFileSync("testReport/"+filename)
    }catch(err){
        if(err.code === 'ENOENT'){
            console.log('File not found!');
            // firstTime = 1;
            console.log('You probably need first generate json report from each xml.')
        }else{
            throw err;
        }
    }
    //convert JSON string to real obj 
    var content = JSON.parse(fileContent);
    // console.log(content);
    for(var i =0 ; i < content.testcase.length; i++){
        var testcase = content.testcase[i];
        // console.log(testcase);
        tests.push({
            name: testcase.name,
            time: testcase.time/repeat,
            fail: (repeat-testcase.status)/repeat
        });
        // console.log(tests[i]);
    }
}