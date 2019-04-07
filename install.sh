#! /bin/bash
baker bake && baker ssh
sudo apt-get install -y npm
sudo npm install
sudo npm i npm@latest -g
sudo mkdir /home/vagrant/jenkins

sudo echo "export AWS_ACCESS_KEY_ID=#{ENV['AWS_ACCESS_KEY_ID']}" >> /etc/environment
sudo echo "export AWS_SECRET_ACCESS_KEY=#{ENV['AWS_SECRET_ACCESS_KEY']}" >> /etc/environment
source /etc/environment