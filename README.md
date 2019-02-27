# Test and Analysis - Milestone 2
In this milestone, we aim to learn about the automation of configuration management and build. Configuration management is a systems engineering process for establishing and maintaining consistency of a product's performance, functional, and physical attributes with its requirements, design, and operational information throughout its life. In this milestone we will be focusing on a pipeline that consists of configuration automation, build automation, test automation and deploy automation. 
This repository covers provisioning, configuring of Jenkins server along with setting up Jenkins build job for [checkbox.io](https://github.com/chrisparnin/checkbox.io) and [iTrust](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v4) applications. A GitHub web-hook is used to trigger the build when a push is made in the repository.

## Learning Outcomes: 


### Screencast
A detailed video with the steps can be found [here]().

### Team Members:

* Arpita (ashekha) - 
* Srija  (sgangul2) - 
* Dyuti  (dde) - 
* Yichi  (yzhan222) - 

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



