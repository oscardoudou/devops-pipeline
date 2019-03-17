var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var Bluebird = require('bluebird')

var testReport =  '/var/lib/jenkins/workspace/iTrust_job/iTrust/iTrust2/target/surefire-reports/TEST-edu.ncsu.csc.itrust2.apitest.APIAppointmentRequestTest.xml';

// if( process.env.NODE_ENV != "test")
// {
//     fs.readdir("/var/lib/jenkins/workspace/iTrust_job/iTrust/iTrust2/target/surefire-reports", (err, files) => { 
//         files.forEach(file => { 
//             if (file.substr(file.length - 4) === '.xml') { 
//                     calculatePriority(file);
//                      // findFlaky();
//             } 
//         }); 
//     });
// }

if( process.env.NODE_ENV != "test")
{
    calculatePriority("TEST-edu.ncsu.csc.itrust2.apitest.APIAppointmentRequestTest.xml");
}
async function findFlaky()
{
    var map = new Map();
    // var map2 = new Map();
    var total = 4;
    for( var i = 0; i < total; i++ )
    {
        try{
            child.execSync('cd ~/iTrust/iTrust2 && mvn clean test verify checkstyle:checkstyle');
        }catch(e){}
        var contents = fs.readFileSync("/var/lib/jenkins/workspace/iTrust_job/iTrust/iTrust2/target/surefire-reports/"+file)
        let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
        var tests = readResults(xml2json);
        tests.sort(function(a,b){
            if(a.status < b.status)
                return -1;
            if(a.status > b.status)
                return 1;
            if(a.status == b.status)
                return a.time - b.time;
        })
        tests.forEach( function(e, i){
            console.log(e);
            if(i == 0){
                if(e.status == 'passed')
                    map.set(e.name,1)
                else
                    map.set(e.name,0);
            }
            else{
                if(e.status == 'passed')
                    map.set(e.name, map.get(e.name) + 1)
            }
        });
    }
    for(var[key,value] of map.entries()){
        var passed = value
        var failed = total - passed
        console.log(key + ' flakyness ' + (passed - failed)/total)
    }
}

function readResults(result)
{
    var tests = [];
    for( var i = 0; i < result.testsuite['$'].tests; i++ )
    {
        var testcase = result.testsuite.testcase[i];
        
        tests.push({
        "name":   testcase['$'].name, 
        "time":   testcase['$'].time, 
        "status": testcase.hasOwnProperty('failure') ? 0: 1
        });
    }    
    return tests;
}

async function calculatePriority(file)
{
    try{
        child.execSync('cd ~/iTrust/iTrust2 && mvn clean test verify checkstyle:checkstyle');
    }catch(e){}
    // var contents = fs.readFileSync(__dirname + testReport)
    var contents = fs.readFileSync("/var/lib/jenkins/workspace/iTrust_job/iTrust/iTrust2/target/surefire-reports/"+file.substr())
    let xml2json = await Bluebird.fromCallback(cb => parser.parseString(contents, cb));
    var tests = readResults(xml2json);
    // tests.sort(function(a,b){
    //     if(a.status < b.status)
    //         return -1;
    //     if(a.status > b.status)
    //         return 1;
    //     if(a.status == b.status)
    //         return a.time - b.time;
    // })
    var xmlReport = {
        "testcase": []
    };
    var firstTime = 0;
    var eUpdate = {};
    var filename = file.substr()+".json";
    for(var i = 0 ; i < tests.length; i++){
        console.log(tests[i]); 
        // fs.open(file.substr()+".json",'r',fucntion(err, fd));
        // var functionTestConclusion = {
        //     name: e.name,
        //     time: 
        // }
        // fs.writeFileSync(file.substr()+".json",e,'utf8')
        // var filename = file.substr()+".json";

        // fs.open("/jenkins-server/"+filename,'r',function(err, fd){
        //     if (err||firstTime===1) {
        //         if(firstTime != 1){
        //             console.log(err);
        //             // fs.writeFileSync(filename,"",'utf8');
        //         }
        //         firstTime = 0;
        //     } else {
        //       var fileContent = fs.readFileSync("/jenkins-server/"+filename, function(err){
        //         if(err){
        //             console.log(err);
        //         }
        //         console.log("READ!");
        //       });
        //       var content = JSON.parse(fileContent);
        //       var functionName = content.testcase[i].name; 
        //       console.log(content.testcase[i].name);
        //       var timeExecute = content.testcase[i].time + tests[i].time;
        //       var statusCount = content.testcase[i].status + tests[i].status;
        //       eUpdate = {
        //         "name": functionName,
        //         "time": timeExecute,
        //         "status": statusCount 
        //       }
        //     }
        //   });

        fs.appendFileSync("jsonreport/"+filename,JSON.stringify(tests[i]),'utf8',function(err){
            if(err) throw err;
            console.log('Append!')
        })

        // if(firstTime === 1)
        //     xmlReport.testcase.push(tests[i]);
        // else
        //     xmlReport.testcase.push(eUpdate);

    };

    // fs.writeFileSync(filename, JSON.stringify(xmlReport),'utf8');
    return tests;
}

module.exports.findFlaky = findFlaky;
module.exports.calculatePriority = calculatePriority;