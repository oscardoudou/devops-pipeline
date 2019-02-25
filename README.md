# Configuration Management and Build - Milestone 1
In this milestone, we aim to learn about configuration management. Configuration management is a systems engineering process for establishing and maintaining consistency of a product's performance, functional, and physical attributes with its requirements, design, and operational information throughout its life. In this miledtone we will be focusing on a pipeline that consists of configuration automantion, build automation, test automation 
This repository covers provisioning, configuring of Jenkins server along with setting up Jenkins build job for [checkbox.io](https://github.com/chrisparnin/checkbox.io) and [iTrust](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4) applications. A GitHub webhook is used to trigger the build when a push is made in the repository.

### Screencast
A detailed video with the steps can be found [here]().

### Team Members:

* Arpita (ashekha) - Build jobs for the two applications and screencast
* Srija  (sgangul2) - Jenkins setup and test script for checkbox.io
* Dyuti  (dde) - Jenkins setup and Git hook
* Yichi  (yzhan222) - Git hook

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

1. Clone this repository: ``` https://github.ncsu.edu/ashekha/DevOps-Project.git ```

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

