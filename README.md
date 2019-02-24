# Configuration Management and Build - Milestone 1
In this milestone, we aim to learn about configuration management. Configuration management is a systems engineering process for establishing and maintaining consistency of a product's performance, functional, and physical attributes with its requirements, design, and operational information throughout its life. In this miledtone we will be focusing on a pipeline that consists of configuration automantion, build automation, test automation 
This repository covers provisioning, configuring of Jenkins server along with setting up Jenkins build job for [checkbox.io](https://github.com/chrisparnin/checkbox.io) and [iTrust](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4) applications. A GitHub webhook is used to trigger the build when a push is made in the repository.

### Screencast
A detailed video with the steps can be found [here]().

### Team Members:

* Arpita (ashekha)
* Srija  (sgangul2)
* Dyuti  (dde)
* Yichi  (yzhan222)

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

2. Traverse into the root directory and then to the ansible-server:
```
cd DevOps-Project/servers/ansible-server
```
3. Run the following commands:
```
baker bake
baker ssh
```
4. Ansible should be installed through the bake command. Next on the local machine move out of ansible-server directory and go to the jenkins-server:
```
cd DevOps-Project/servers/jenkins-server
```
5. Redo the 3rd step again for this server.

6. Setup ssh keys to connect between the two servers:
```
ssh-keygen -t rsa -b 4096 -C "jenkins-server" -f jenkins-server
pbcopy < jenkins-server (for MAC) or clip < jenkins-server (for Windows)
```
Then ``` baker ssh ``` into ansible-server and paste the private key into the ``` ~/.ssh ``` directory.
For setting the public key, ```baker ssh``` into jenkins-server and it needs to be copied into the ```~/.ssh/authorized_keys```
#### Note : Key generation will follow the same steps as mentioned in [CM Workshop](https://github.com/CSC-DevOps/CM#creating-a-connection-between-your-servers). 

To check the connection between the servers run:
```
ansible all -m ping -i inventory

```

7. Set environment variables required for cloning the NCSU github repository inside the jenkins-server VM after ```baker ssh```.
* GITHUB_USERNAME 
* GITHUB_PASSWORD

8. Create a db.properties file in templates directory with the following contents (you may leave the password blank): 
  ```
url jdbc:mysql://localhost:3306/iTrust2?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=EST&allowPublicKeyRetrieval=true
username <Your username>
password
  ```
9. Create a email.properties file in template directory with the following contents: 
 ```
from <donotreply/your name>
username <Your username>
password <Your password>
host smtp.gmail.com
 ```  
10. In the ansible-server VM , after ``` baker ssh ``` run the following commands:
```
cd /ansible-server
ansible-playbook run.yml -i inventory

```
It should run all the playbooks together that involves all the 4 tasks in the project.

11. Traverse to http://192.168.33.200:8090 for the live Jenkins server. 

12. Traverse to http://192.168.33.200 for the live checkbox.io service.

 13: Traverse to http://192.168.33.200:8080 for the live iTrust service.

14. Make changes to the checkbox and iTrust repositories and add it under version control, eg. `touch demo; git add demo; git commit -m "demo"`. Push the changes into production to see the Jenkins build trigger using, `git push prod master`. 

#### Note : To see the build jobs taking place after the git hook gets invoked, traverse to the live jenkins server and find the process under the job names "checkbox_job" and "iTrust_job".
