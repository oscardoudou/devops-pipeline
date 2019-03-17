var filesystem = require('fs')
var xml2js = require('xml2js')
var jenkinsapi = require('jenkins-api')
var path = require('path')
var parser = new xml2js.Parser();
var jenkins = jenkinsapi.init('http://{{jenkins_user}}:{{jenkins_password}}@http://192.168.33.200:8090');

// read xml files from surefire-reports
function readFiles() {
    var filePath = '/var/lib/jenkins/workspace/iTrust_job/iTrust/iTrust2/target/surefire-reports'
    var files = filesystem.readdirSync(filePath);
    var xmlFiles = []

    files.forEach(function(file) {
        if(path.extname(file) == '.xml') {
            xmlFiles.push(filePath + '/' + file)
        }
    });

    //console.log(xmlFiles)
    return xmlFiles
}
jenkins.last_build_info('iTrust_job', function(err, data) {
    if (err){ return console.log(err); }
    console.log(data)
});

var listOfFiles = readFiles()
var testResults = []

listOfFiles.forEach(function(file) {
    var content = filesystem.readFileSync(file)
    
    parser.parseString(content, function (err, result) {
        result.testsuite.testcase.forEach(function(test,index,array){
            //testResults[test['$'].name] = {time: test['$'].time, success: test.hasOwnProperty('failure') ? 0 : 1}
            testResults.push({
                name:   test['$'].name, 
                time:   test['$'].time, 
                status: test.hasOwnProperty('failure') ? "failed": "passed"
            });
        })
    })
    
    analyzeResults(testResults)
    //testResults.sort(compare);
    //console.log(testResults)
})

function analyzeResults(results) {
    var successTests = [], failedTests = []

    results.forEach(function(test) {
        if(test.status == "passed") {
            successTests.push(test)
            successTests.sort(compare)
        } else {
            failedTests.push(test)
            failedTests.sort(compare)
        }
    })

    //console.log("Successsss!!!!!!!!!!!!!!!", successTests)
    console.log("Failure!!!!!!!!!!!!!!!", failedTests)

}

function compare(a, b) {
    return a.time - b.time
}

// function compare(a, b) {
//     return b.status == "failed"
// }
