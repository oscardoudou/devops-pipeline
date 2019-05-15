# Deployment, Infrastucture and Special - Milestone 3

### Project Demo
A detailed video for project demo including our entire pipeline can be found [here](https://drive.google.com/file/d/1pq_ddWmJsAMA_zs85JFEIaK7tE4jTZ01/view?usp=sharing). 

### Screencast
A detailed video with the steps can be found [here](https://drive.google.com/file/d/1ZvrcKc1lSJfHIAJZZzDB9kdt3oHDjiC8/view?usp=sharing).

### Team Members:

* Arpita (ashekha) - Deployment, Feature flags.
* Srija  (sgangul2) - Deployment, Feature flags.
* Dyuti  (dde) - Special Component, Testing.
* Yichi  (yzhan222) - Infrastructure.

## Prerequisites
* You need to have [VirtualBox 5.2](https://www.virtualbox.org/wiki/Download_Old_Builds_5_2) installed on your machine along with [Baker](https://docs.getbaker.io/installation/) which will be used to create the virtual machines (Ubuntu 16.04 LTS).
* An [AWS](https://aws.amazon.com/premiumsupport/plans/) account is needed to access the EC2 instances created. 
* A [New Relic](https://newrelic.com/) account is needed to see the monitoring results.



## Systems and tools used:

* Ansible : v2.7.7
* Jenkins : v2.150.2
* Node : v4.2.6
* Npm : v3.5.2
* pip / pip3
* Java : v1.8
* MySql : v14.14 Distrib 5.7.25
* Apache Maven : v3.3.9
* New Relic
* Java Redis client : v2.8.1
* Docker 
* Kubernetes 

## Environment variables to be set:

* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* MONGO_USER
* MONGO_PASSWORD
* MONGO_IP
* MONGO_PORT
* APP_PORT
* MAIL_USER
* MAIL_PASSWORD
* MAIL_SMTP
* CLUSTER_NAME
* NEW_RELIC_LICENSE_KEY

## Repositories used at several stages:

* [Checkbox local repository](https://github.com/arpitashekhar/checkbox.io)
* [iTrust local repository](https://github.com/arpitashekhar/iTrust2-v4)


## Project Setup

We detail our milestone in terms of separate tasks to explain the functionalities achieved in each of them.

This milestone consisted of 4 major tasks:

### 1. Deployment Component

For the deployment component we provision the Jenkins EC2 instance from our local ansible-server VM using [aws-jenkins.js](https://github.ncsu.edu/ashekha/DevOps-Project/blob/DeploymentInfraMilestone/servers/aws-jenkins.js) file. From the Jenkins server we build the iTrust and Checkbox application and run the appications on two seperate EC2 instances using the file [aws-checkbox.js](https://github.ncsu.edu/ashekha/DevOps-Project/blob/DeploymentInfraMilestone/servers/aws-checkbox.js) and [aws-itrust.js](https://github.ncsu.edu/ashekha/DevOps-Project/blob/DeploymentInfraMilestone/servers/aws-itrust.js). The post-receive hooks trigger the set up of applications on these EC2 instances.

The Jenkins dashboard with build jobs for applications:

![jobs](/images/sc19.png?raw=true "jobs")


* Sign up with [AWS](https://aws.amazon.com/premiumsupport/plans/) to create an account and create an [access key](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)
* Run the ansible-server and install.sh file to install node dependencies
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* Run node aws-jenkins.js to provision Jenkins server
* Finally run the ansible file : jenkins.yml

 To run the Checkbox and iTrust applications: 

* ssh into Jenkins server 
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* Within the checkbox.io/iTrust repository make a small change (like touch test) and push to checkbox/iTrust(set remote for deployment repositories) master to triger the hook. 
* You should be finding the git hook going live by first creating the Checkbox/iTrust instances and then running configurations through a playbook.
* Go to AWS dashboard to see the Checkbox and iTrust running green and copy the public IP to a browser to see the Checkbox and iTrust applications
work well.

![awsconsole](/images/sc18.png?raw=true "awsconsole")

### 2. Feature Flag
The configuration server for feature flag is same as iTrust EC2 instance. We are using the Java Redis client [Jedis](https://www.baeldung.com/jedis-java-redis-client-library) to implement feature flag in production. We have selected the reset password API as the feature to enable and disable.

We modified the pom.xml to include Redis as the dependency and also modified the APIPasswordController.java to include the following changes:
![javacode](/images/sc20.png?raw=true "javacode")

iTrust application will display "Feature Disabled" and the submit button will be disabled on the username page when the redis key is set to 'false' whereas it will display the originally intended messages and the button will work as usual when the key is set to 'true'.

When key is set to false in redis-cli, iTrust feature is disabled:
![redis](/images/sc4.PNG?raw=true "redis")

![ff](/images/sc5.PNG?raw=true "ff")

When key is set to true in redis-cli, iTrust feature is enabled:
![redis2](/images/sc6.PNG?raw=true "redis2")

![ff2](/images/sc7.PNG?raw=true "ff2")



 
### 3. Infrastructure Component

We extract microservice code, containerize that part of code and modify original server.js

For this task, we require access to S3 bucket service(backup k8s state) and ECR(Elastic Container Registry register docker images) and we assume you have one bucket in S3 and one repo in ECR.


In order to setup the cluster:
1. Set Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
2. `cd servers` and run `node aws-dev.js` to provision Dev server, where we run our infrastructure playbook `ansible-playbook infrastructure.yml -i ~/inventory`.
3. Set Environment variable CLUSTER_NAME, equivalent to specify `-name` for kops command, keep consistent with playbook script, just set CLUSTER_NAME env var. 
4. Currently KOPS_STATE_STORE is retrieving from `aws s3 ls | awk '{print $3}` rather retrieving identical named env var on vagrant VM, so in order to run script need to has a exist S3 bucket

Notes:
* Remove the previous private key Dev.pem under `~/dev` if exist to avoid undefined pem file
* Remove previous security group on aws console
* Don't forget manually using kops delete the cluster if you don't need infrastruture anymore, otherwise cluster would be brought up even terminate on aws console and you aws billing would frighten you.
* To delete cluster you need specify state store and cluster name, latter could be retrieved by cluster list, both cluster list and furhter cluster validate need kops state store argument, using existed one would be `--state=s3://checkbox-state-store`, as said above playbook currently dont support create fresh s3 bucket on the fly.
* Last flaw setting environment var using ansible module on target machine(in our case dev machine) is not feasible now, so simply retrieve those env var from vagrant VM.


For more detailed explanation of tasks present in ansible script (infrastructure.yml) or the extensive steps to replicate, please go to [this link](https://github.com/oscardoudou/markdown-microservice)
 
Multiple instances of Checkbox via Infrastructure upgrade:

![instances](/images/sc1.PNG?raw=true "instances")


Kubernetes pods (5) being described which host the microservice:

![pods](/images/sc2.PNG?raw=true "pods")



### 4. Special Component

We use New Relic as a software monitoring tool. It provides customized analytics and application performance management solution that gives in-depth data visibility and analytics. New Relic's Application Monitoring tool or APM, provides us with detailed performance metrics for every aspect of our environment. We can see metrics like throughput, memory usage and CPU usage to monitor the system. We also show the web transaction time chart and the database transaction performance given by the underlying MongoDB database. 

To set up New Relic, we first install the NodeJS APM distribution available for New Relic. We copy the license key to newrelic.js file to connect our app with New Relic dashboard and finally include it in our startup script to send real time app data to New Relic. 

* Make an account on [New Relic](https://newrelic.com/), set an environment variable NEW_RELIC_LICENSE_KEY in the local VM using the license key available on your account. 
* Follow the steps to deploy Checkbox.io on AWS
* After completion, you should be able to see the data reported from the application on New Relic dashbobard.

We load tested the monitoring task by using [Siege](https://en.wikipedia.org/wiki/Siege_(software)). Concurrent users were simulated and the difference in flame graphs were noted for CPU utilization, memory usage etc. We noticed spikes for the same in sudden increase of users.

Some of the results of montoring are displayed below:

Web transaction time by Checkbox:

![time](/images/sc9.PNG?raw=true "time")

Top 5 web transactions:

![web](/images/sc10.PNG?raw=true "web")

MongoDB overview and transaction trends:

![db](/images/sc11.PNG?raw=true "db")

Web transaction report:

![post](/images/sc14.PNG?raw=true "post")

Memory usage by the application:
![mem](/images/sc12.PNG?raw=true "mem")

CPU utilization by the system due to the application over time:
![CPU](/images/sc13.PNG?raw=true "CPU")


