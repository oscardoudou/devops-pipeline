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

* Arpita (ashekha) - 
* Srija  (sgangul2) - 
* Dyuti  (dde) - 
* Yichi  (yzhan222) - 

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

## Project Setup

There are 2 virtual machines called ansible-server and jenkins-server. The former is initialized with ansible and playbooks are run to configure the jenkins-server. 
This milestone consisted of 4 major tasks:

### 1. Coverage / Jenkins Support
##### Relevant Files: 
* ansible-server/tasks/jenkins.yml
* ansible-server/templates/test.yml
* ansible-server/templates/project.yml

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

### 4. Static Analysis

* iTrust

* checkbox.io

## Report

## How to run the code
