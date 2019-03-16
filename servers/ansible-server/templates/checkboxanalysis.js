// The code reads through a stack of files and finds the value of max condition , longest method and detects possible presence of security tokens. 
// Depending on the allotted thresholds, it logs the files which crosses that value.
var esprima = require("esprima");
var options = {tokens:true, tolerant:true, loc:true, range:true};
var fs = require("fs");

// alloting threshold above which build should fail
var maxnumberofconditions = 3;
var longestmethodlength = 15;
var securitytoken = false;


var filepath = ["public_html/codegrams/task/scripts/TaskViewModel.js", 
"public_html/codegrams/task/scripts/view.js",
"public_html/js/html5.js",
"public_html/js/ie-fix.js",
"public_html/js/researchers.js",
"public_html/models/StudyListing.js",
"public_html/models/studies.js",
"public_html/scripts/Markdown.Converter.js",
"public_html/scripts/async.js",
"public_html/scripts/fingerprint.js",
"public_html/scripts/knockout.v2.2.1.js",
"public_html/scripts/markdown.js",
"public_html/scripts/prettify.js",
"public_html/scripts/purl.js",
"public_html/scripts/run_prettify.js",
"public_html/studies/snippets/scripts/view.js",
"public_html/studies/study.js",
"public_html/surveys/surveys.js",
"server-side/site/server.js",
"server-side/site/marqdown.js",
"server-side/site/routes/admin.js",
"server-side/site/routes/create.js",
"server-side/site/routes/csv.js",
"server-side/site/routes/designer.js",
"server-side/site/routes/live.js",
"server-side/site/routes/study.js",
"server-side/site/routes/studyModel.js",
"server-side/site/routes/upload.js"];

// Annotates nodes with parent objects.
function traverseWithParents(object, visitor) {
    var key, child;
    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') {
            	child.parent = object;
					    traverseWithParents(child, visitor);
            }
        }
    }
}

// counting children of node


// Count the max number of conditions within an if statement in a function
function maxconditions(filepath){
  var max = 0;
  var maxcondition = 0;
  var file = fs.readFileSync(filepath, "utf8");
  var ast = esprima.parse(file, options);
  var line = 0 ;
  var maxline = 0;
  var tokens = esprima.tokenize(file, options);

  // traverse program

  traverseWithParents(ast, function(node) {
    if(node.type === 'IfStatement') {
  	  maxcondition = 1;
      // traverse its children 
<<<<<<< HEAD
    
=======
      console.log("am in an if statement");
>>>>>>> ca1c754d61a6a65dd8b5ca321f3553e5c21ee643
     	traverseWithParents(node, function(child){
        if(child.type === 'LogicalExpression') {
          maxcondition = maxcondition + 1;
        }
      })
      if (maxcondition > max) {
          max = maxcondition;
      }
    }
  })
  
  return max;
}

// returns length of the longest method in a file

function depth(filepath) {
   var file = fs.readFileSync(filepath, "utf8");
   var ast = esprima.parse(file, options);
   var functionname = "";
   var max = 0;
   var start , stop;
   var maxdepth = 0;
   var functionmaxdepth = "";

  // go down the tree to search for function declaration
  traverseWithParents(ast, function(node){

    if(node.type === 'FunctionDeclaration') {
      functionname = node.id.name;
      start = node.loc.start.line;
      stop = node.loc.end.line;
      maxdepth = stop - start + 1 ;
    }

    if(maxdepth > max){
     max = maxdepth;
     functionmaxdepth = functionname;
    }
  })
  console.log(functionmaxdepth + "() is the longest method");

  return max;
}

// considers a security token to be a word that exceeds 8 characters and that starts with letters and is a combination of letters and digits.
// it could directly flag words such as "password","security", "key" as security tokens too.
function securitytokens(filepath) {

  var file = fs.readFileSync(filepath, "utf8");
  var ast = esprima.parse(file, options);
  var token = "";
  var start = [];
  var startname =[];
  var len = 0;
  var present = false;
  //var regex = /[^[a-zA-Z]+[0-9]+]*|[^[a-zA-z]+[0-9]*]*/;
  var regex = /[a-zA-Z]+[0-9]*$/ ;
  var nameregex = [/pass/i, /password/i, /key/i, /security/i];

  // go down the tree for checking a literal 
  traverseWithParents(ast, function(node){
    if(node.type == 'Literal' && typeof(node.value) == 'string') {
      token = node.value;
      
      // checking value length and type
      len = token.length;
      if(len > 8) {
        if(regex.test(token)) {
          start.push(node.loc.start.line);
          //console.log(token);
        }
      }
    }

    if(node.type == 'VariableDeclarator') {
        for( var i = 0; i < nameregex.length; i++) {
          if(nameregex[i].test(node.id.name)) {
            startname.push(node.loc.start.line);
          }
        }
    }
  })
  var flag = 1;

  // loop over start array and check if any value is added

  if((start.length >= 1) || (startname.length >= 1)) {
    console.log("There are security tokens in file : " + filepath);

    for(var j = 0 ; j < start.length; j++) {
      if(start[j] > 0)
        console.log("..at line number : " + start[j]);
    }
    for(var k = 0; k < startname.length; k++) {
      for(var l = 0; l < start.length; l++) {
        if(startname[k] == start[l])
          flag = 0;
      }

      if(flag == 1)
        console.log("..at line number : " + startname[k]);

    }
    presence = true;
  } else {
    console.log("No security tokens in file : " + filepath);
  }

  return presence;
}



// display the result

//console.log("In file " + filepath + " max conditions in an if statement is: " + maxconditions(filepath));
//console.log("In file " + filepath + " longest method length is: " + depth(filepath));
//securitytokens(filepath);

console.log("Listing all the JavaScript files: ");
filepath.forEach(function(element){
  console.log(element);

});

console.log("Maximum conditions within if statments analysis: ");

filepath.forEach(function(element){
  console.log(maxconditions(element));

});

console.log("Long methods analysis: ");

filepath.forEach(function(element){
  console.log(depth(element));

});

console.log("security tokens analysis: ");

filepath.forEach(function(element){
  console.log(securitytokens(element));

});







