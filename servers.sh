#! /bin/bash
cd servers/ansible-server && baker bake && cd ../jenkins-server && baker bake && cd servers/ansible-server/ && baker ssh