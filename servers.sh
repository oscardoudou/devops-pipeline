#! /bin/bash
cd servers/ansible-server && baker bake && cd ../jenkins-server && baker bake && cd ../ansible-server/ && baker ssh