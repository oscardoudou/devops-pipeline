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

### 2. Commit Fuzzer

### 3. Test Prioritization Analysis

### 4. Static Analysis

* iTrust

* checkbox.io

## Report

## How to run the code
