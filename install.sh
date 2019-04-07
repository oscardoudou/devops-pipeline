#! /bin/bash

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && sudo apt-get install -y nodejs && node -v && sudo npm install npm --global
mkdir /home/vagrant/jenkins && npm install
