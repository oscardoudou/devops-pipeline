# Deployment, Infrastucture and Special - Milestone 3


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
* Jacoco : v3.0.4
* Esprima : v4.0.0
* Checkstyle : v4.0.0

## Project Setup

There are 2 virtual machines called ansible-server and jenkins-server. The former is initialized with ansible and playbooks are run to configure the jenkins-server.
This milestone consisted of 4 major tasks:

### 1. Deployment Component


* Sign up with [AWS](https://aws.amazon.com/premiumsupport/plans/) to create an account and create an [access key](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)

* Run the ansible-server and install.sh file to install node dependencies
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* Run node aws-jenkins.js to provision Jenkins server
* Finally run the ansible file : jenkins.yml
###### Within Jenkins server (Checkbox)--

* ssh into Jenkins server 
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* Within the checkbox.io repository make a small change (like touch test) and push to checkbox master to triger the hook. [NOTE: checkbox is the remote set towards /home/ubuntu/deploy/checkbox-www for the green-blue deployment] 
* You should be finding the git hook going live by first creating the Checkbox instance and then running configuration through a playbook.
* Go to AWS dashboard to see the Checkbox running green and copy the public IP to a browser to see the Checkbox application work well.


### 2. Infrastructure Component

*extract microservice code, containerlize that part of code and modify origin server.js*

*require access to S3 bucket service(backup k8s state) and ECR(Elastic Container Registry register docker images) assume you one bucket in S3 and one repo in ECR*

If first 2 step is already done during Deployment Component, then no need creata a VM or install node again. Jump to step 3

* Run baker bake && baker ssh
* cd /DevOps-Project and run install.sh file to install node dependencies
* Set Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
* cd servers and run node aws-dev.js to provision Dev server, where we run our infrastrutrue playbook.
* Set Environment variable CLUSTER_NAME

### 3. Special Component
We use New Relic as a software monitoring tool. It provides customized analytics and application performance management solution that gives in-depth data visibility and analytics. New Relic's Application Monitoring tool or APM, provides us with detailed performance metrics for every aspect of our environment. We can see metrics like throughput, memory usage and CPU usage to monitor the system. We also show the web transaction time chart and the database transaction performance given by the underlying MongoDB database. 

To set up New Relic, we first install the NodeJS APM distribution available for New Relic. We copy the license key to newrelic.js file to connect our app with New Relic dashboard and finally include it in our startup script to send real time app data to New Relic. 


* Make an account on [New Relic](https://newrelic.com/), set an environment variable NEW_RELIC_LICENSE_KEY in the local VM using the license key available on your account. 
* Follow the steps to deploy Checkbox.io on AWS
* After completion, you should be able to see the data reported from the application on New Relic dashbobard.
