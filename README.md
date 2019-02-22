CSC 519 Project Milestone 1 <br/> 
Team 3 
<div style="text-align: center"> 
	
1) Team Members with unity IDs: <br/>
 - Arpita (ashekha) <br/>
 - Srija  (sgangul2) <br/>
 - Dyuti  (dde) <br/>
 - Yichi  () <br/>

2) Systems and tools used:


3) Description: <br/>
This repository consists of the first milestone for the team project. There are 2 virtual machines called ansible-server and jenkins-server.The former is initialized with ansible and playbooks are run to configure the jenkins-server. This milestone consisted of 4 major tasks:

- Provisioning and configuring a Jenkins server on a remote VM using ansible
	- Provisioning was achieved by installing the required dependencies for jenkins like jre8 and installing jenkins using apt-get.
	- Configuration of jenkins involved reading the initial admin password and unlocking the account to create a user. Plugins were installed via jenkins_plugin module. Both are achieved through the jenkins.yml playbook.

- Using a combination of jenkins-job-builder and ansible to setup automatic build jobs for the applications, checkbox.io and iTrust.
	- For fulfilling this task, the first objective was to clone and configure the repositories of checkbox.io and iTrust. Both had a set of dependencies that required setting up on the jenkins-server. Verifying that the builds pass on the system manually were most important steps. 
	- Checkbox is configured via checkbox.yml and iTrust is configured via itrust.yml and chrome.yml.
	- The jenkins-job-builder plugin was installed through the jenkins.yml file and jobs were created via the templates , project.yml , default.yml and test.yml for both the applications.

- Using a combination of mocha and pm2 to create a test script that starts and stops the checkbox.io service on the server.
	- This was achieved by setting up the package.json file of checkbox.io with the test command as "mocha". This is being done in the checkbox.yml playbook itself.
	- The test file is written using mocha as a framework and dependencies such as chai, request and shelljs. Pm2 is used to manage the start and stop of the node file server.js within checkbox.io. Mocha and pm2 along with the required additional dependencies have been installed via mocha.yml file. 
	- The test file starts the service , checks the http status codes on both the server and one of the api endpoints to be 200 , and then stops the service. The test can be run via "npm test".

- 	Creating a simple git hook to trigger a build for the applications when a push is made to the repository.
	- The project.yml file within the templates folder is being moved to the jobs directory of the jenkins-server. This file consists of the build commands for both the applications.



4) Issues faced:

5) How to run the code:

6) Screencast:
</div>


