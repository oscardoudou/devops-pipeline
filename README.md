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
##### Relevant Files:


* Sign up with [AWS](https://aws.amazon.com/premiumsupport/plans/) to create an account and create an [access key](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)

* Run baker bake && baker ssh
* cd /DevOps-Project and run install.sh file to install node dependencies
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* cd servers and run node aws-jenkins.js to provision Jenkins server
* ansible-playbook -i /home/vagrant/inventory jenkins.yml

###### Within Jenkins server (Checkbox)--
* ssh into Jenkins server just configured from the current VM using the command ``` ssh -i /home/vagrant/jenkins/Jenkins.pem ubuntu@<jenkins_ip> ``` [NOTE: You will find the ```<jenkins_ip>``` in the var file or from the AWS running instance named Jenkins]
* Set Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY with the respective values
* Within the Jenkins server , cd /home/ubuntu/checkbox.io and make a small change (like touch test)
* run the commands: ``` git add ,  git commit -m <message> ,  git push checkbox master ```
[NOTE: checkbox is the remote set towards /home/ubuntu/deploy/checkbox-www for the green-blue deployment] 
* You should be finding the git hook going live by first creating the Checkbox instance and then running configuration through a playbook.
* Go to AWS dashboard to see the Checkbox running green and copy the public IP to a browser to see the Checkbox application work well.





### 2. Infrastructure Component
##### Relevant Files:


### 3. Special Component
##### Relevant Files:



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
