# Configuration Management and Build - Milestone 1
In this milestone, we aim to learn about the automation of configuration management and build. Configuration management is a systems engineering process for establishing and maintaining consistency of a product's performance, functional, and physical attributes with its requirements, design, and operational information throughout its life. In this milestone we will be focusing on a pipeline that consists of configuration automation, build automation, test automation and deploy automation. 
This repository covers provisioning, configuring of Jenkins server along with setting up Jenkins build job for [checkbox.io](https://github.com/chrisparnin/checkbox.io) and [iTrust](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4) applications. A GitHub web-hook is used to trigger the build when a push is made in the repository.

## Learning Outcomes: 
### 1. Provisioning and configuring a Jenkins server:
Jenkins is a continuous integration tool used to automate the software pipeline from building, testing and deployment. We learnt to automate several installation and configuration tasks using Ansible required to set-up Jenkins. It was tricky because, to automate things, we often need to understand the behind-scenes of a command.

We were facing issue, where certain tasks would fail for the first time and run smoothly on the second run on-wards. So we figured that the files that were called were taking some time to create and were not created by the time we called them. We resolved the issue by putting delay till the files could be created properly, all through Ansible script. Bypassing Jenkins setup wizard was also tricky as we had less ideas about the platform that it takes more time to reload the server, so a time lapse had to be put in between, that would hold off the next tasks until the server was up.

Jenkins installation and configuration took 2 people of our team to work on. There were certain dependencies that needed to be fulfilled. For downloading plugins as well, we had to bypass security so that the jenkins user would have enough rights to install the plugins. Every installation required jenkins server to be reloaded. 
### 2. Automatically build jobs for 2 applications:
We used Jenkins job builder for this task, as it seemed to be well documented and had a better developer community support. Jenkins Job Builder takes simple descriptions of Jenkins jobs in YAML or JSON format and uses them to configure Jenkins. You can keep your job descriptions in human readable text format in a version control system to make changes and auditing easier. It also has a flexible template system, so creating many similarly configured jobs is easy.
#### 2.1 Building jobs for checkbox.io:
checkbox.io is a site for hosting simple surveys created in markdown. It has dependencies on nginx, node, monogodb which could be installed smoothly by following the developer guide. We did not face any issues while completing this part. 
#### 2.2 Building jobs for iTrust
iTrust2 is a Java application which has a set of unit tests.

Since it was the first time we were working with Maven, it took us a lot of time to setup the tool, especially getting used to its command lines. 
### 3. Test scripts for checkbox.io
The application didn't have any specific start and stop methods like we had in the Pipelines workshop, so figuring out how to start the checkbox service via pm2 required us to read the documentation and implementation guidelines of pm2. Mocha is a new testing framework for all of us, so learning how to write test scripts via Mocha also required a bit of research work. Once, when we were running the playbook on a fresh VM, the latest version of Mocha got installed -because the maintenance team had upgraded that 50 minutes before we played the tasks- which couldn't run with the current version of node. This taught us to always make sure that we put version numbers while installing modules from now onwards.

In addition, while implemeting "got" module, the tests continuously failed because our implemented node version didn't support it, because of which we had to fall back to the "request" module. It worked brilliantly when combined with the pm2 shell commands using the "shelljs" module.  

After the server started, it was mostly important for us to place a REST call to an api endpoint to check if the server is actually responding. A status code of 200 would mean its a success. The server would be stopped after that using pm2 as well.
Apart from the previous issues, test scripts were smoothly figured out. Later this test was invoked via the build jobs of checkbox.io.

### 4. Git hook
Git hooks are scripts that run automatically every time a particular event occurs in a Git repository. In this module, we recreated our [Pipeline workshop](https://github.com/CSC-DevOps/Pipelines) for a more practical requirement. We used a post-receive hook to trigger Jenkins to build jobs on changes being pushed to the production server. It helped us to actually understand the requirement of a bare repository for post-receive hook and how it  can be modified to achieve various automation funtionality. 

First, we were using the given repositories to clone checkbox and iTrust repositories. But while pushing to prod we were facing access denied error, may be because we don't have the push access to the given repositories. To solve that we tried to change the remote url using `git remote set-url <our git forked repo>` command. But we soon realized that though it is working fine for the iTrust reposiory, the checkbox test scripts are failing. Though we were getting a build success on hook triggers we detected that the test scripts required certain hidden installations which were preceding the `git remote set-url` command. We finally cloned the checkbox repository from the <our git forked repo>  and the issue was resolved. 

### Screencast
A detailed video with the steps can be found [here]().

### Team Members:

* Arpita (ashekha) - Build jobs for the two applications and screencast , readme writeup
* Srija  (sgangul2) - Jenkins setup and test script for checkbox.io  , readme writeup
* Dyuti  (dde) - Jenkins setup and Git hook implementation , readme writeup
* Yichi  (yzhan222) - Git hook preparation.

## Prerequisites
You need to have [VirtualBox 5.2](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) installed on your machine along with [Baker](https://docs.getbaker.io/installation/) which will be used to create the virtual machines (Ubuntu 16.04 LTS).

### Systems and tools used:

* Ansible : v2.7.7
* Jenkins : v2.150.2
* Node : v4.2.6
* Npm : v3.5.2
* pip / pip3
* Java : v1.8
* Nginx : v1.10.3 
* MongoDb :  v3.6.10
* Mocha : v5.2.0 (latest not recomended)
* PM2 : v3.2.9
* MySql : v14.14 Distrib 5.7.25
* Apache Maven : v3.3.9 

### Project Setup

There are 2 virtual machines called ansible-server and jenkins-server. The former is initialized with ansible and playbooks are run to configure the jenkins-server. 
This milestone consisted of 4 major tasks:
1. Provisioning was achieved by installing the required dependencies for jenkins like jre8 and installing jenkins using apt-get.
2. Configuration of jenkins involved reading the initial admin password and unlocking the account to create a user. Plugins were installed via jenkins_plugin module. Both are achieved through the jenkins.yml playbook.
3. Using a combination of jenkins-job-builder and ansible to setup automatic build jobs for the applications, checkbox.io and iTrust. Checkbox is configured via checkbox.yml and iTrust is configured via itrust.yml and chrome.yml.
4. Creation of a test script that starts and stops the checkbox.io service on the server using a combination of mocha and pm2. The test file starts the service, checks the http status code (200) on both the server and the api endpoints (developers.html) and then stops the service.
5. Creating a simple git hook to trigger a build for the applications when a push is made to the repository.

#### Note: The Jenkins server can be accessed via this [url](http://192.168.33.200:8090) on port 8090, once the playbook runs successfully. 

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

4. Set environment variables required for cloning the NCSU github repository inside the jenkins-server VM.
* GITHUB_USERNAME 
* GITHUB_PASSWORD

5. Create a db.properties file in templates directory with the following contents (you may leave the password blank): 
  ```
url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true
username <Your username>
password
  ```
6. Create a email.properties file in template directory with the following contents: 
 ```
from <donotreply/your name>
username <Your username>
password <Your password>
host smtp.gmail.com
 ```  
7. In the ansible-server VM , after ``` baker ssh ``` run the following commands:
```
cd /ansible-server
ansible-playbook run.yml -i inventory
```
It should run all the playbooks together that involves all the 4 tasks in the project.

8. After the playbook runs successfully, we can access the following: 
* [Jenkins server](http://192.168.33.200:8090)
* [checkbox.io](http://192.168.33.200)

##### Note: Since, we are running the ``` mvn clean test verify checkstyle:checkstyle ``` command through build job, the application has not been setup on a local port.

9. Make changes to the checkbox and iTrust repositories and add it under version control, eg. `touch demo; git add demo; git commit -m "demo"`. Push the changes into production to see the Jenkins build trigger using, `git push prod master`. 

##### Note : To see the build jobs taking place after the git hook gets invoked, traverse to the live jenkins server and find the process under the job names "checkbox_job" and "iTrust_job".

