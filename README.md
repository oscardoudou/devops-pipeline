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
* test prioritizaton [3 parts please watch in sequence](https://www.dropbox.com/sh/ije37pvnt02v0xr/AADJ33WfFRBagrJgHsRMF4xza?dl=0)

### Team Members:

* Arpita (ashekha) - Jenkins coverage setup , commit fuzzer , test prioritization
* Srija  (sgangul2) - Jenkins coverage setup , commit fuzzer operations , analysis
* Dyuti  (dde) - Jenkins setup , post-commit hook, analysis
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
 
On successful complation we add the fuzzed files to git commit which starts the build automatically otherwise, we reset the changes and fuzz again. 

![iTrust Fuzzer job](/resources/fuzzer.png?raw=true "Fuzzer Job")

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



# Report
### Approach
- For fuzzing, we randomly select files to be fuzzed and applied random fuzzing operations.
- We created a post-commit hook to trigger the builds after each commit and reverted failing changes.
- In our prioritzaion approach, we are first sorting the test cases based on average failure and average time across all 100 builds.

Different type of tests suffer differently against fuzzing. Test case against single or less functional behavior are more likely to succeed, unit tests almost always pass even with unrealistic input. However, integration test cases or more complex functions are more likely to fail. Since it is sensitive to the input data, in which case, failure rate of API tests sometimes reach up to 80%.


Some ways in which we can extend the fuzzer and its operations in future are:
1. We can determine the codes that are more likely to have bugs so that the fuzzer can pre-select those files first. This will make our fuzzer work more intelligently.
2. We can explore the generative fuzzing for a more thorough testing.
3. We can work on fuzzing the input for each function to emulate black box testing.

The tests that failed the most were like ```testHospitalForm```, ```testDrugLookup``` etc were ranked the highest. We also prioritized the tests that took lesser time because it will allow us to cover more test cases in shorter duration of time.

To extend on the difficulty of approaches, we tried to work on an AST diff tool named GumtreeDiff , that is known to generate diff of two code files on a web server. The installation steps could be found inside the checkboxanalysis.yml but are commented because we faced a basic internal server error when we tried to access that link on our host. It starts the server on localhost@4567.

Some ways in which these tests can help a software developer are:
1. It can help them prevent long-methods and putting too many conditions together so that bugs can be reduced and branch coverage can be increased.
2. Knowing that there is no security token will enable the software developers to make less vulnerable softwares.
3. Removing redundancy will help reduce cost of code.

### Analysis
  For the Checkbox, max-condition was generated using the keyword ```IfStatement``` and the number of ```LogicalExpression``` it had in its child nodes. To detect Long methods , we first check if its a ```FunctionDeclaration``` and then find the start line and end line numbers , whose difference should be the depth.
For finding security tokens , any ```Literal``` that is of type ```string``` , is greater than 10 characters and that matches a regular expression of a combination of letters and digits could be possibly marked as a security token.
The thresholds are marked by us in the checkboxanalysis.js file , and if these are exceeded a file called build.txt is generated and is considered in the ```conditional buildstep``` (of Jenkins job template) module to mark the build as failed. If the ```builder``` doesn't find the file generated it will pass the build.  

For the iTrust, we incorporated the Checkstyle plugin in the ```publishers``` module in jenkins job template, that picks up the checkstyle-result.xml file after the job build generates the file through its checkstyle checks. The report is shown at the end of the build and on an unfuzzed code it finds no warnings.

## How to run the code
1. Clone this repository: ```git clone https://github.ncsu.edu/ashekha/DevOps-Project.git ```

2. Run shell script inside the DevOps-Project directory to setup the ansible and jenkins server:
```
cd DevOps-Project
sh servers.sh
```

3. Setup ssh keys to connect between the two servers:
From your host machine, create a new public/private key pair, running the following command, and hitting enter for the default prompts
```
ssh-keygen -t rsa -b 4096 -C "jenkins-server" -f jenkins-server
```

#### Setting up the private key

One nice trick is to use a copy utility to copy a file into your copy/paste buffer:

* Mac: `pbcopy < jenkins-server`
* Windows: `clip < jenkins-server`

Inside the ansible-server using a file editor, paste and store your private key in a file:

```bash
ansible-server $ vim ~/.ssh/jenkins-server
# Make sure key is not readable by others.
ansible-server $ chmod 600 ~/.ssh/jenkins-server
# We're done here, go back to host
ansible-server $ exit
```

#### Setting up the public key

Copy the jenkins-server.pub file from your host.

Go inside the jenkins-server.

Using a file editor, add the public key to the list of authorized keys:

```bash
jenkins-server $ vim ~/.ssh/authorized_keys
jenkins-server $ exit
```
To check the connection between the servers run:
```
ansible all -m ping -i inventory
```

4. Create a db.properties file in templates directory with the following contents (you may leave the password blank):
  ```
url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true
username <Your username>
password
  ```
5. Create a email.properties file in template directory with the following contents:
 ```
from <donotreply/your name>
username <Your username>
password <Your password>
host smtp.gmail.com
 ```  
6. In the ansible-server VM , after ``` baker ssh ``` run the following commands:
```
cd /ansible-server
ansible-playbook playbook.yml -i inventory
```
It should run all the playbooks together that involves all the 4 tasks in the project. It successfully generates all the jenkins jobs which can be accessed through [port 8090](https://192.168.33.200:8090) - ```checkbox_job_added, iTrust_Analysis_job, iTrust_Coverage_job, iTrust_Fuzzer_job```.

7. Next, run the ```commitfuzzer.yml```, which generates 100 builds of ```iTrust_Fuzzer_job``` using the post-commit hook. All the other jobs can be built manually from the Jenkins dashboard.
