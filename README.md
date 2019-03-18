# Test and Analysis - Milestone 2
In this milestone, we aim to learn about the test and build analysis. 
In addition to tasks accomplished in last milestone:
* We are using the [Jacoco](https://plugins.jenkins.io/jacoco) plugin for code coverage of iTrust application. 
* We have replaced the post-receive hook by a post-commit hook to trigger the fuzzer and revert back after the build report is generated.
* The fuzzing tool comprizes of two files: 
  * initiateFuzzer.js - runs 100 times via an ansible task
  * fuzzer.js - fuzzing operations on randomly selected files
* The test prioritization task uses testPrior.js file
* The checkbox.io analysis is done using checkboxanalysis.js and checkboxanalysis.yml

### Screencast
A detailed video with the steps can be found [here]().

### Team Members:

* Arpita (ashekha) - Jenkins coverage setup , commit fuzzer , test prioritization
* Srija  (sgangul2) - Jenkins coverage setup , commit fuzzer operations , analysis 
* Dyuti  (dde) - Jenkins setup , commit fuzzer , analysis
* Yichi  (yzhan222) - test prioritization

## Prerequisites
You need to have [VirtualBox 5.2](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) installed on your machine along with [Baker](https://docs.getbaker.io/installation/) which will be used to create the virtual machines (Ubuntu 16.04 LTS).

## Systems and tools used:

* Ansible : v2.7.7
* Jenkins : v2.150.2
* Node : v4.2.6
* Npm : v3.5.2
* pip / pip3
* Java : v1.8
* MySql : v14.14 Distrib 5.7.25
* Apache Maven : v3.3.9 
* Jacoco : v3.0.4
* Esprima : v4.0.0
* Checkstyle : v4.0.0

## Project Setup

There are 2 virtual machines called ansible-server and jenkins-server. The former is initialized with ansible and playbooks are run to configure the jenkins-server. 
This milestone consisted of 4 major tasks:

### 1. Coverage / Jenkins Support
##### Relevant Files: 
* ansible-server/tasks/jenkins.yml
* ansible-server/templates/test.yml
* ansible-server/templates/projects.yml

For displaying the code coverage of iTrust repository, we are using the jacoco plugin. We have used Jenkins Job Builder's publisher to include jacoco as a post-build task. The parameters for branch, instruction, complexity etc. have been set as well. 

After the build succeeds, we can see the threshold values and coverage results. 

![Job Build](/resources/jacoco_build.png?raw=true "Build Screen")

We can also see the coverage summary report for each build jobs.

![Overall Coverage](/resources/overall_coverage.png?raw=true "Overall Coverage")

The coverage report for each function inside the java files as well.

![Function Coverage](/resources/function_coverage.png?raw=true "Function Coverage")

### 2. Commit Fuzzer
##### Relevant Files: 
* ansible-server/tasks/commitfuzzer.yml
* ansible-server/templates/fuzzer.js
* ansible-server/templates/initiateFuzzer.js
* ansible-server/templates/post-commit

The commit fuzzer task is invoked from commitfuzzer.yml. We are using initiateFuzzer.js to make commits, run fuzzer.js and revert the changes. 
The commit invokes the iTrust build in Jenkins using a post-commit hook which specifies the jenkins url.

Inside fuzzer.js we have 4 functions that carry out the fuzzing operation:
* change content of "strings" in code.
* swap "<" with ">"
* swap "==" with "!="
* swap 0 with 1


### 3. Test Prioritization Analysis
##### Relevant Files: 
* ansible-server/templates/testPrior.js
* ansible-server/templates/priorSummary.js

Use one json per xml under surefile-reports/ to store either API test or unit test. Update json file's value per commit(fuzzing).

Calculate average executeTime and overall failure rate in n iteraton. Prioritize all the test cases across xml based on n iteration's result.  

xml.json example:
![xml.json example part1](/resources/xml_json.png?raw=true)
test prior report:
![prior report part1](/resources/prior_report1.png?raw=true)
![prior report part2](/resources/prior_report2.png?raw=true)
![prior report part3](/resources/prior_report3.png?raw=true)
### 4. Static Analysis

* iTrust

##### Relevant Files: 
* ansible-server/tasks/iTrust.yml
* ansible-server/templates/projects.yml
* ansible-server/templates/test.yml

The iTrust is setup via iTrust.yml and there are two jobs being generated through the projects.yml and test.yml that are moved to the job workspace within the virtual machine. One job reflects the checkstyle analysis of the checkstyle-result.xml after the build has taken place. For this we used the checkstyle plugin in the publishers.

The following screenshot shows the output of checkstyle plugin:

![iTrust analysis output](/resources/checkstyle_analysis.PNG?raw=true "iTrust analysis output")

Setting up conditional builds required the conditional buildstep plugin. 

* checkbox.io

##### Relevant Files: 
* ansible-server/tasks/checkbox.yml
* ansible-server/tasks/checkboxanalysis.yml
* ansible-server/templates/checkboxanalysis.js
* ansible-server/templates/projects.yml
* ansible-server/templates/test.yml


We chose nodejs and esprima to work on calculating the maximum number of conditions, longest method length and the detection of possible security tokens in the file checkboxanalysis.js which is being invoked from the checkboxanalysis.yml.
The builds on the jenkins dashboard are managed by using conditional-buildstep plugin.
The result on the console at the time of running the code is in the following form for each of the JavaScript file:

![Checkbox analysis output](/resources/max_cond_example.PNG?raw=true "Checkbox analysis output")

Depending on what threshold has been set for each, there is a build.txt file generated if any one of the threshold is exceeded, which marks that the build will have to fail:

![Checkbox analysis fail build notice](/resources/max_cond_result.PNG?raw=true "Checkbox analysis fail build notice")

The corresponding build in the jenkins console fails :

![Checkbox analysis fail build](/resources/checkbox_build_failed.PNG?raw=true "Checkbox analysis fail build")

If the threshold didn't exceed then the build.txt file won't be generated and the build won't fail:

![Checkbox analysis success build output](/resources/max_cond_pass_example.PNG?raw=true "Checkbox analysis success build output")

The corresponding build in the jenkins console succeeds:

![Checkbox analysis success build](/resources/checkbox_build_success.PNG?raw=true "Checkbox analysis success build")



## Report

Every step of the milestone has been a challenge and some steps were tough to work on. 

#### Jenkins Setup

Jenkins was setup during the last milestone which was carried forward in this milestone. There were a few plugins added to support coverage and analysis of codes. 
The major trouble we faced here was configuring all the plugins individually, and some of these wouldn't get installed in the first run of the jenkins.yml playbook. Maven is one such plugin that became too difficult to handle.
The other plugins added with dependencies are jacoco , checkstyle and conditional-buildstep.

#### Commit Fuzzer

#### Test Prioritization

#### Analysis

## How to run the code
